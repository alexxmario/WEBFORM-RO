from pathlib import Path
import re, html, json
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT

ROOT=Path('/Users/alexmario/Desktop/WEBFORM Romania')
SOURCE=ROOT/'output/pdf/GHID-COMPLET-META-ADS-V4.md'
OUTPUT=ROOT/'output/pdf/GHID-COMPLET-META-ADS-V4.pdf'
pdfmetrics.registerFont(TTFont('Guide','/System/Library/Fonts/Supplemental/Arial.ttf'))
pdfmetrics.registerFont(TTFont('GuideBold','/System/Library/Fonts/Supplemental/Arial Bold.ttf'))
pdfmetrics.registerFontFamily('Guide',normal='Guide',bold='GuideBold',italic='Guide',boldItalic='GuideBold')
W,H=595.276,841.89
M=48
BW=W-2*M
INK=HexColor('#182F2C')
TEAL=HexColor('#197363')
MUTED=HexColor('#536764')
LIGHT=HexColor('#EAF1ED')
PAPER=HexColor('#FCFCF8')

styles={
 'body':ParagraphStyle('body',fontName='Guide',fontSize=10.7,leading=14.9,textColor=INK,spaceAfter=8),
 'bullet':ParagraphStyle('bullet',fontName='Guide',fontSize=10.7,leading=14.6,textColor=INK,leftIndent=11,firstLineIndent=-11,spaceAfter=4),
 'number':ParagraphStyle('number',fontName='Guide',fontSize=10.7,leading=14.6,textColor=INK,leftIndent=16,firstLineIndent=-16,spaceAfter=4),
 'h3':ParagraphStyle('h3',fontName='GuideBold',fontSize=12.2,leading=15.3,textColor=TEAL,spaceAfter=5,spaceBefore=7),
 'callout':ParagraphStyle('callout',fontName='GuideBold',fontSize=10.7,leading=15.2,textColor=INK,spaceAfter=11),
 'url':ParagraphStyle('url',fontName='Guide',fontSize=8.7,leading=12,textColor=TEAL,spaceAfter=8,splitLongWords=True),
 'title':ParagraphStyle('title',fontName='GuideBold',fontSize=27,leading=29.7,textColor=INK,spaceAfter=15),
 'source':ParagraphStyle('source',fontName='Guide',fontSize=8.2,leading=11.5,textColor=MUTED,spaceAfter=6),
 'cover':ParagraphStyle('cover',fontName='GuideBold',fontSize=36,leading=39,textColor=INK,spaceAfter=22),
}

def mark(txt):
    txt=html.escape(txt)
    return re.sub(r'\*\*(.+?)\*\*',r'<b>\1</b>',txt)

def blocks(raw):
    chunks=[]
    pending=[]
    def flush():
        if pending:
            chunks.append(('body',' '.join(pending)))
            pending.clear()
    for line in raw.strip().splitlines():
        if not line.strip():
            flush()
        elif line.startswith('### '):
            flush();chunks.append(('h3',line[4:]))
        elif line.startswith('> '):
            flush();chunks.append(('callout',line[2:]))
        elif line.startswith('Sursă:'):
            flush();chunks.append(('source',line))
        elif line.startswith('https://'):
            flush();chunks.append(('url',line))
        elif line.startswith('- '):
            flush();chunks.append(('bullet','• '+line[2:]))
        elif re.match(r'^\d+\. ',line):
            flush();chunks.append(('number',line))
        else:
            pending.append(line)
    flush()
    return chunks

pages=[]
for raw in SOURCE.read_text().split('\n---\n'):
    lines=raw.strip().splitlines()
    title=lines[0][2:]
    kicker=lines[1][3:]
    pages.append((title,kicker,blocks('\n'.join(lines[2:]))))
assert len(pages)==50, len(pages)

c=canvas.Canvas(str(OUTPUT),pagesize=(W,H))
c.setTitle('Ghid complet Meta Ads | Ediția 4.0 | Calibrare Webform V2')
c.setAuthor('Manual de lucru pentru utilizator')
c.setSubject('Strategie, creație, exemple, testare și prompturi AI')
stats=[]
for page_index,(title,kicker,content) in enumerate(pages,1):
    c.setFillColor(PAPER); c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFillColor(TEAL); c.rect(M,H-39,25,2,fill=1,stroke=0)
    c.setFont('GuideBold',7.3)
    c.drawString(M+33,H-40,'METODA SABRI SUBY / RECLAME META')
    c.setFillColor(MUTED); c.setFont('Guide',7.2)
    c.drawRightString(W-M,H-40,'EDIȚIA 4.0')
    c.bookmarkPage(f'p{page_index}')
    c.addOutlineEntry(title,f'p{page_index}',0)
    c.setFillColor(TEAL); c.setFont('GuideBold',9)
    c.drawString(M,H-76,kicker.upper())
    y=H-91
    compact = page_index in (46,47,48,50)
    page_styles = {key: ParagraphStyle('compact_'+key, parent=value, fontSize=value.fontSize*0.91, leading=value.leading*0.91, spaceAfter=value.spaceAfter*0.75, spaceBefore=value.spaceBefore*0.8) for key,value in styles.items()} if compact else styles
    p=Paragraph(mark(title),styles['cover' if page_index==1 else 'title'])
    _,h=p.wrap(BW,1000); p.drawOn(c,M,y-h); y-=h+(22 if page_index==1 else 17)
    if page_index==3:
        toc_h=ParagraphStyle('toc_h',fontName='GuideBold',fontSize=10.3,leading=13.5,textColor=TEAL,spaceAfter=7,spaceBefore=8)
        toc_b=ParagraphStyle('toc_b',fontName='Guide',fontSize=9.3,leading=12.5,textColor=INK,leftIndent=0,spaceAfter=4)
        third_heading=next(i for i,(kind,txt) in enumerate(content) if kind=='h3' and txt.startswith('Conversie'))
        split_at=next(i for i,(kind,txt) in enumerate(content) if kind=='bullet' and txt.startswith('• 22'))
        columns=[content[:split_at],[('h3','Producție și optimizare (continuare)')]+content[split_at:]]
        ends=[]
        for col,items in enumerate(columns):
            yy=y; xx=M+col*(BW+22)/2; ww=(BW-22)/2
            for kind,txt in items:
                ss=toc_h if kind=='h3' else toc_b
                yy-=ss.spaceBefore
                pp=Paragraph(mark(txt.removeprefix('• ')),ss)
                _,hh=pp.wrap(ww,1500)
                if yy-hh < 65: raise RuntimeError(f'TOC overflow in column {col}: {yy-hh}')
                pp.drawOn(c,xx,yy-hh)
                match=re.match(r'• (\d+)',txt)
                if match:c.linkRect('',f'p{int(match[1])}',(xx,yy-hh,xx+ww,yy),relative=0,thickness=0)
                yy-=hh+ss.spaceAfter
            ends.append(yy)
        y=min(ends)
        content=[]
    for kind,txt in content:
        style=page_styles[kind]
        if kind=='h3': y-=style.spaceBefore
        is_callout=kind=='callout'
        width=BW-28 if is_callout else BW
        if kind=='url':
            esc=html.escape(txt,quote=True)
            rendered=f'<link href="{esc}" color="#197363">{esc}</link>'
        else: rendered=mark(txt)
        p=Paragraph(rendered,style)
        _,h=p.wrap(width,1500)
        extra=20 if is_callout else 0
        if y-h-extra < 65:
            raise RuntimeError(f'Page {page_index} overflows: {y-h-extra:.1f}, {txt[:70]}')
        if is_callout:
            c.setFillColor(LIGHT);c.roundRect(M,y-h-20,BW,h+20,4,fill=1,stroke=0)
            c.setFillColor(TEAL);c.rect(M,y-h-20,3,h+20,fill=1,stroke=0)
            p.drawOn(c,M+14,y-h-10)
        else:
            p.drawOn(c,M,y-h)
        if page_index==3 and kind=='bullet':
            match=re.match(r'• (\d+)',txt)
            if match: c.linkRect('',f'p{int(match[1])}',(M,y-h,W-M,y),relative=0,thickness=0)
        y-=h+extra+style.spaceAfter
    if page_index in (47,48):
        filename = '04-dupa-lansare.png' if page_index == 47 else '10-trei-pasi.png'
        image_path = ROOT/'output/meta-broad-ghid-v3/imagini-v2'/filename
        c.drawImage(str(image_path),M,68,width=168,height=210,preserveAspectRatio=True,mask='auto')
        note = '<b>Reper vizual aprobat</b><br/><br/>Fotografie cu aspect firesc, obiecte recognoscibile, hook lizibil și un subtitlu care susține beneficiul. Imaginea deschide aceeași întrebare ca textul.<br/><br/>Transferă mecanismul și naturalețea. Nu copia obligatoriu biroul, cana sau bilețelele în fiecare reclamă.<br/><br/>Scenă ilustrativă generată AI; nu este dovadă de client.'
        pp=Paragraph(note,styles['body']); _,hh=pp.wrap(BW-190,400);pp.drawOn(c,M+190,278-hh)
    c.setStrokeColor(HexColor('#C8D7D0'));c.setLineWidth(.6);c.line(M,47,W-M,47)
    c.setFillColor(MUTED);c.setFont('Guide',7.4)
    c.drawString(M,32,'Metoda V2 + calibrare creativă aprobată.')
    c.setFont('GuideBold',8);c.drawRightString(W-M,32,f'{page_index:02d} / {len(pages):02d}')
    stats.append({'page':page_index,'title':title,'bottom':round(y,1)})
    c.showPage()
c.save()
(ROOT/'tmp/pdfs/guide-v4/layout.json').write_text(json.dumps(stats,ensure_ascii=False,indent=2))
print(json.dumps({'output':str(OUTPUT),'pages':len(pages),'minimum_bottom':min(p['bottom'] for p in stats)},ensure_ascii=False))
