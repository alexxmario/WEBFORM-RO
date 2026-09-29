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
SOURCE=ROOT/'output/pdf/Ghid-complet-generare-reclame.md'
OUTPUT=ROOT/'output/pdf/Ghid-complet-generare-reclame.pdf'
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
assert len(pages)==30, len(pages)

c=canvas.Canvas(str(OUTPUT),pagesize=(W,H))
c.setTitle('Ghid complet pentru generarea reclamelor | Ediția 2.0')
c.setAuthor('Manual de lucru pentru utilizator')
c.setSubject('Strategie, creație, exemple, testare și prompturi AI')
stats=[]
for page_index,(title,kicker,content) in enumerate(pages,1):
    c.setFillColor(PAPER); c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFillColor(TEAL); c.rect(M,H-39,25,2,fill=1,stroke=0)
    c.setFont('GuideBold',7.3)
    c.drawString(M+33,H-40,'GHID UNIVERSAL / GENERAREA RECLAMELOR')
    c.setFillColor(MUTED); c.setFont('Guide',7.2)
    c.drawRightString(W-M,H-40,'EDIȚIA 2.0')
    c.bookmarkPage(f'p{page_index}')
    c.addOutlineEntry(title,f'p{page_index}',0)
    c.setFillColor(TEAL); c.setFont('GuideBold',9)
    c.drawString(M,H-76,kicker.upper())
    y=H-91
    p=Paragraph(mark(title),styles['cover' if page_index==1 else 'title'])
    _,h=p.wrap(BW,1000); p.drawOn(c,M,y-h); y-=h+(22 if page_index==1 else 17)
    for kind,txt in content:
        style=styles[kind]
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
        if page_index==2 and kind=='bullet':
            match=re.match(r'• (\d+)',txt)
            if match: c.linkRect('',f'p{int(match[1])}',(M,y-h,W-M,y),relative=0,thickness=0)
        y-=h+extra+style.spaceAfter
    c.setStrokeColor(HexColor('#C8D7D0'));c.setLineWidth(.6);c.line(M,47,W-M,47)
    c.setFillColor(MUTED);c.setFont('Guide',7.4)
    c.drawString(M,32,'Cercetare. Relevanță. Dovezi. Testare.')
    c.setFont('GuideBold',8);c.drawRightString(W-M,32,f'{page_index:02d} / {len(pages):02d}')
    stats.append({'page':page_index,'title':title,'bottom':round(y,1)})
    c.showPage()
c.save()
(ROOT/'tmp/pdfs/guide_layout.json').write_text(json.dumps(stats,ensure_ascii=False,indent=2))
print(json.dumps({'output':str(OUTPUT),'pages':len(pages),'minimum_bottom':min(p['bottom'] for p in stats)},ensure_ascii=False))
