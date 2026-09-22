import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks=vi.hoisted(()=>({user:vi.fn(),from:vi.fn()}));
vi.mock("@/lib/server-user",()=>({getServerUser:mocks.user}));
vi.mock("@/lib/supabase/server",()=>({supabaseServerAdmin:()=>({from:mocks.from})}));
import { GET, PATCH } from "@/app/api/admin/route";
const id="12345678-1234-4234-8234-123456789012";
const request=(body:unknown,origin?:string)=>new Request("http://localhost:3000/api/admin",{method:"PATCH",headers:{"Content-Type":"application/json",...(origin?{origin}:{})},body:JSON.stringify(body)});
function role(value:string){mocks.user.mockResolvedValue({id});mocks.from.mockReturnValue({select:()=>({eq:()=>({single:async()=>({data:{role:value}})})})});}
beforeEach(()=>{vi.resetAllMocks();mocks.user.mockResolvedValue(null);});
describe("Admin authorization and workflow",()=>{
 it("rejects anonymous reads before accessing data",async()=>{expect((await GET(new Request("http://localhost:3000/api/admin"))).status).toBe(401);expect(mocks.from).not.toHaveBeenCalled();});
 it("rejects anonymous writes",async()=>{expect((await PATCH(request({}))).status).toBe(401);expect(mocks.from).not.toHaveBeenCalled();});
 it("rejects clients even if the request claims admin",async()=>{role("client");expect((await PATCH(request({role:"admin"}))).status).toBe(403);expect(mocks.from).toHaveBeenCalledTimes(1);});
 it("rejects client reads",async()=>{role("client");expect((await GET(new Request("http://localhost:3000/api/admin"))).status).toBe(403);});
 it("rejects cross-origin mutations",async()=>{role("admin");expect((await PATCH(request({},"https://other.test"))).status).toBe(403);expect(mocks.from).not.toHaveBeenCalled();});
 it("rejects unknown tables and invalid pagination",async()=>{role("admin");expect((await GET(new Request("http://localhost:3000/api/admin?view=secrets&page=-1"))).status).toBe(400);expect(mocks.from).toHaveBeenCalledTimes(1);});
 it("cannot change billing or roles through workflow updates",async()=>{role("admin");expect((await PATCH(request({id,status:"published",notes:"",revision:id,role:"admin",amount:0}))).status).toBe(400);expect(mocks.from).toHaveBeenCalledTimes(1);});
 it("detects stale updates instead of overwriting another admin",async()=>{role("admin");const auth=mocks.from();const update=vi.fn(()=>({eq:()=>({eq:()=>({select:()=>({maybeSingle:async()=>({data:null,error:null})})})})}));mocks.from.mockReturnValueOnce(auth).mockReturnValueOnce({update});expect((await PATCH(request({id,status:"review",notes:"Review",revision:id}))).status).toBe(409);expect(update).toHaveBeenCalled();});
 it("saves allowed workflow fields with a fresh revision",async()=>{role("admin");const auth=mocks.from();const update=vi.fn(()=>({eq:()=>({eq:()=>({select:()=>({maybeSingle:async()=>({data:{id,workflow_status:"review"},error:null})})})})}));mocks.from.mockReturnValueOnce(auth).mockReturnValueOnce({update});expect((await PATCH(request({id,status:"review",notes:"Review",revision:id}))).status).toBe(200);expect(update).toHaveBeenCalledWith(expect.objectContaining({workflow_status:"review",admin_notes:"Review",admin_revision:expect.any(String)}));});
});

describe("Admin unified inbox", () => {
 it("loads all public form sources by default after admin authorization", async () => {
  role("admin");
  const auth = mocks.from();
  const records: Record<string, unknown[]> = {
   campaign_leads: [{ id, source: "instalatii", name: "Test instalator", phone: "0700000000", created_at: "2026-09-17" }],
   waitlist: [{ id: "contact", tier: "Contact", business_type: JSON.stringify({ email: "test@example.com", message: "Salut" }), created_at: "2026-09-16" }],
   blueprints: [{ id: "project", business_name: "Test brief", created_at: "2026-09-15" }],
  };
  mocks.from.mockImplementation((table: string) => {
   const query = { select: vi.fn(), order: vi.fn(), range: vi.fn() };
   query.select.mockReturnValue(query); query.order.mockReturnValue(query);
   query.range.mockResolvedValue({ data: records[table], count: records[table].length, error: null });
   return query;
  }).mockReturnValueOnce(auth);
  const response = await GET(new Request("http://localhost:3000/api/admin"));
  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data.total).toBe(3);
  expect(data.rows.map((row: { submission_source: string }) => row.submission_source)).toEqual(["Instalatori", "Formular contact", "Brief proiect"]);
  expect(data.rows[0].phone).toBe("0700000000");
  expect(response.headers.get("Cache-Control")).toBe("private, no-store");
 });
});
