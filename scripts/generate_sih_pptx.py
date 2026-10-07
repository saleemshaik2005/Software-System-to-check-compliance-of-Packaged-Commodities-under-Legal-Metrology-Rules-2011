import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # blank layout

    # Colors
    c_navy = RGBColor(10, 54, 99)       # #0A3663 Govt Deep Blue
    c_sih_blue = RGBColor(0, 79, 158)   # #004F9E SIH Official Blue
    c_teal = RGBColor(15, 118, 110)     # #0F766E
    c_dark = RGBColor(15, 23, 42)       # #0F172A Slate Dark
    c_gray = RGBColor(100, 116, 139)    # #64748B Slate Muted
    c_light_bg = RGBColor(248, 250, 252)# #F8FAFC Card BG
    c_white = RGBColor(255, 255, 255)
    c_red = RGBColor(220, 38, 38)       # #DC2626
    c_green = RGBColor(22, 163, 74)     # #16A34A
    c_border = RGBColor(226, 232, 240)  # #E2E8F0
    c_gold = RGBColor(217, 119, 6)      # #D97706

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    logo_inspack = os.path.join(base_dir, "public", "logos", "inspack-logo.jpg")
    logo_neural = os.path.join(base_dir, "public", "logos", "neural-knights-logo.jpg")
    img_amul_front = os.path.join(base_dir, "public", "demo", "amul-taaza-front.png")
    img_amul_back = os.path.join(base_dir, "public", "demo", "amul-taaza-back.png")
    img_pintola_front = os.path.join(base_dir, "public", "demo", "pintola-front.png")

    def add_common_header(slide, title_text, category_badge="SIH-26034 | Ministry of Consumer Affairs"):
        # Top Header Bar
        hdr = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(1.15))
        hdr.fill.solid()
        hdr.fill.fore_color.rgb = c_navy
        hdr.line.color.rgb = c_navy

        # Team Pill (Top Left)
        pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(0.18), Inches(2.3), Inches(0.78))
        pill.fill.solid()
        pill.fill.fore_color.rgb = c_white
        pill.line.color.rgb = c_gold
        pill.line.width = Pt(1.5)
        tf_p = pill.text_frame
        tf_p.word_wrap = True
        p_p = tf_p.paragraphs[0]
        p_p.text = "Team: Neural Knights"
        p_p.font.size = Pt(10)
        p_p.font.bold = True
        p_p.font.color.rgb = c_navy
        p_p.alignment = PP_ALIGN.CENTER

        p_p2 = tf_p.add_paragraph()
        p_p2.text = "CBIT, Hyderabad"
        p_p2.font.size = Pt(8)
        p_p2.font.color.rgb = c_gray
        p_p2.alignment = PP_ALIGN.CENTER

        # Slide Title
        tx_box = slide.shapes.add_textbox(Inches(2.9), Inches(0.15), Inches(7.6), Inches(0.85))
        tf = tx_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(19)
        p.font.bold = True
        p.font.color.rgb = c_white

        p_sub = tf.add_paragraph()
        p_sub.text = category_badge
        p_sub.font.size = Pt(9.5)
        p_sub.font.color.rgb = RGBColor(190, 220, 255)

        # SIH Emblem badge on right
        sih_pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.7), Inches(0.18), Inches(2.2), Inches(0.78))
        sih_pill.fill.solid()
        sih_pill.fill.fore_color.rgb = c_white
        sih_pill.line.color.rgb = c_sih_blue
        sih_pill.line.width = Pt(1.5)
        tf_s = sih_pill.text_frame
        tf_s.word_wrap = True
        p_s = tf_s.paragraphs[0]
        p_s.text = "SMART INDIA"
        p_s.font.size = Pt(9)
        p_s.font.bold = True
        p_s.font.color.rgb = c_sih_blue
        p_s.alignment = PP_ALIGN.CENTER
        p_s2 = tf_s.add_paragraph()
        p_s2.text = "HACKATHON 2026"
        p_s2.font.size = Pt(8.5)
        p_s2.font.bold = True
        p_s2.font.color.rgb = c_navy
        p_s2.alignment = PP_ALIGN.CENTER

        # Bottom Footer Strip
        ftr = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(7.1), Inches(13.333), Inches(0.4))
        ftr.fill.solid()
        ftr.fill.fore_color.rgb = c_sih_blue
        ftr.line.color.rgb = c_sih_blue
        tf_f = ftr.text_frame
        p_f = tf_f.paragraphs[0]
        p_f.text = "@SIH Idea submission - Template  |  INSPACK: Software System to check compliance of Packaged Commodities (LMPC Rules, 2011)"
        p_f.font.size = Pt(8.5)
        p_f.font.color.rgb = c_white
        p_f.alignment = PP_ALIGN.CENTER

    def add_card(slide, x, y, w, h, bg_color=c_light_bg, border_color=c_border):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.2)
        return card

    # =========================================================================
    # SLIDE 1: TITLE PAGE
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    
    # Top banner
    hdr1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(1.3))
    hdr1.fill.solid()
    hdr1.fill.fore_color.rgb = c_navy
    hdr1.line.color.rgb = c_navy
    tf1 = hdr1.text_frame
    p1 = tf1.paragraphs[0]
    p1.text = "SMART INDIA HACKATHON 2026"
    p1.font.size = Pt(24)
    p1.font.bold = True
    p1.font.color.rgb = c_white
    p1.alignment = PP_ALIGN.CENTER
    p1_sub = tf1.add_paragraph()
    p1_sub.text = "IDEAS • INTELLIGENCE • IMPACT — TECH FOR A FAIRER MARKET"
    p1_sub.font.size = Pt(9.5)
    p1_sub.font.color.rgb = RGBColor(190, 220, 255)
    p1_sub.alignment = PP_ALIGN.CENTER

    # Project Title Card (Left)
    card_proj = add_card(slide1, Inches(0.5), Inches(1.5), Inches(7.5), Inches(5.35), c_white, c_navy)
    tf_cp = card_proj.text_frame
    tf_cp.word_wrap = True
    
    p = tf_cp.paragraphs[0]
    p.text = "INSPACK 🛡️📦"
    p.font.size = Pt(26)
    p.font.bold = True
    p.font.color.rgb = c_navy

    p = tf_cp.add_paragraph()
    p.text = "AI-Based Legal Metrology Packaged Commodities Compliance & Inspection System"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = c_teal

    items = [
        ("Problem Statement ID:", "SIH-26034"),
        ("Problem Statement Title:", "Software System to check compliance of Packaged Commodities under the Legal Metrology (Packaged Commodities) Rules, 2011 by scanning products, images and labels"),
        ("Ministry / Organization:", "Ministry of Consumer Affairs, Food & Public Distribution — Department of Consumer Affairs / Legal Metrology Division"),
        ("Theme:", "Agriculture, FoodTech & Rural Development / Public Governance"),
        ("Category:", "Software (AI Computer Vision + Deterministic Legal Rules Engine)"),
        ("Live Prototype URL:", "https://inspacknksih2026.vercel.app/")
    ]

    for label, val in items:
        p_item = tf_cp.add_paragraph()
        p_item.text = f"• {label} "
        p_item.font.size = Pt(9)
        p_item.font.bold = True
        p_item.font.color.rgb = c_navy
        
        # add value
        p_val = tf_cp.add_paragraph()
        p_val.text = f"   {val}"
        p_val.font.size = Pt(8.5)
        p_val.font.color.rgb = c_dark

    # Team Nomination Card (Right)
    card_team = add_card(slide1, Inches(8.2), Inches(1.5), Inches(4.6), Inches(5.35), c_light_bg, c_sih_blue)
    tf_ct = card_team.text_frame
    tf_ct.word_wrap = True
    
    p = tf_ct.paragraphs[0]
    p.text = "TEAM: NEURAL KNIGHTS"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = c_sih_blue

    p_col = tf_ct.add_paragraph()
    p_col.text = "Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad"
    p_col.font.size = Pt(8.5)
    p_col.font.bold = True
    p_col.font.color.rgb = c_gray

    p_nom = tf_ct.add_paragraph()
    p_nom.text = "AICTE Reg: 1-44641605560 • Nominated by Principal CBIT"
    p_nom.font.size = Pt(7.5)
    p_nom.font.italic = True
    p_nom.font.color.rgb = c_gray

    team_members = [
        ("Shaik Saleem (Team Leader)", "160124771129", "B.E AIDS-2, 3rd Year"),
        ("D. Rishwanth Reddy", "160124771105", "B.E AIDS-2, 3rd Year"),
        ("Dasari Hitharth", "160124771106", "B.E AIDS-2, 3rd Year"),
        ("Pachimatla Hasini", "160124771084", "B.E AIDS-2, 3rd Year"),
        ("B. Venkat Sai Ram", "160125733151", "B.E CSE-3, 2nd Year"),
        ("G. Rohith Nandhan", "160125733158", "B.E CSE-3, 2nd Year")
    ]

    p_t = tf_ct.add_paragraph()
    p_t.text = "— Team Roster —"
    p_t.font.size = Pt(8.5)
    p_t.font.bold = True
    p_t.font.color.rgb = c_teal

    for name, roll, dept in team_members:
        pm = tf_ct.add_paragraph()
        pm.text = f"👤 {name}"
        pm.font.size = Pt(8.5)
        pm.font.bold = True
        pm.font.color.rgb = c_dark
        
        pm_sub = tf_ct.add_paragraph()
        pm_sub.text = f"    Roll: {roll} | {dept}"
        pm_sub.font.size = Pt(7.5)
        pm_sub.font.color.rgb = c_gray

    # Bottom strip Slide 1
    ftr1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(7.1), Inches(13.333), Inches(0.4))
    ftr1.fill.solid()
    ftr1.fill.fore_color.rgb = c_sih_blue
    ftr1.line.color.rgb = c_sih_blue
    tf_f1 = ftr1.text_frame
    p_f1 = tf_f1.paragraphs[0]
    p_f1.text = "@SIH Idea submission - Template | Title Page | Problem Statement ID: SIH-26034"
    p_f1.font.size = Pt(8.5)
    p_f1.font.color.rgb = c_white
    p_f1.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 2: PROPOSED SOLUTION
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_common_header(slide2, "IDEA TITLE: INSPACK — PROPOSED SOLUTION", "Proposed Solution (Describe your Idea / Solution / Prototype)")

    # 3 Pointer Sub-Banners required by official template
    p_box = slide2.shapes.add_textbox(Inches(0.4), Inches(1.2), Inches(12.5), Inches(0.4))
    tf_pb = p_box.text_frame
    p_req = tf_pb.paragraphs[0]
    p_req.text = "❖ Detailed explanation of proposed solution  •  How it addresses the problem  •  Innovation and uniqueness"
    p_req.font.size = Pt(10.5)
    p_req.font.bold = True
    p_req.font.color.rgb = c_sih_blue

    # Card 1: 5-Stage End-to-End Visual Workflow
    card_flow = add_card(slide2, Inches(0.4), Inches(1.65), Inches(8.3), Inches(2.9), c_white, c_navy)
    tf_cf = card_flow.text_frame
    tf_cf.word_wrap = True
    p = tf_cf.paragraphs[0]
    p.text = "AUTOMATED 5-STAGE INSPECTION WORKFLOW"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = c_navy

    flow_steps = [
        ("1. Multi-View Capture", "Front PDP, Back declarations, Side batch panels captured via guided camera."),
        ("2. Visual Extraction", "Extracts 20+ statutory entities (Net Mass, SI Units, MRP, Dates, PIN, Consumer Care)."),
        ("3. Deterministic Rules", "Evaluates against LMPC Rules 6, 7, 8, 9, 10, 13, 18, 22 and Second Schedule."),
        ("4. Evidence Overlay", "Renders interactive bounding boxes directly on packaging with exact gazette citations."),
        ("5. Statutory Report", "1-Click Seventh Schedule Form A & Form B PDF dossier with Section 65B certificate.")
    ]
    for stitle, sdesc in flow_steps:
        p_st = tf_cf.add_paragraph()
        p_st.text = f"▶ {stitle}: "
        p_st.font.size = Pt(8.5)
        p_st.font.bold = True
        p_st.font.color.rgb = c_teal
        
        p_sd = tf_cf.add_paragraph()
        p_sd.text = f"    {sdesc}"
        p_sd.font.size = Pt(8)
        p_sd.font.color.rgb = c_dark

    # Card 2: Innovation & Uniqueness (Bottom Left)
    card_innov = add_card(slide2, Inches(0.4), Inches(4.65), Inches(8.3), Inches(2.35), c_light_bg, c_teal)
    tf_in = card_innov.text_frame
    tf_in.word_wrap = True
    p = tf_in.paragraphs[0]
    p.text = "CORE INNOVATION: EXPLAINABLE DECISION SUPPORT"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = c_teal

    innov_points = [
        ("Beyond Raw OCR:", "Existing OCR only extracts text. INSPACK connects what is printed to the legal requirement an officer must verify."),
        ("Deterministic Law:", "Zero AI hallucination risk in statutory checks. Evaluates Table-I numeral heights, standard pack sizes, and MPE thresholds deterministically."),
        ("Inspection-Support:", "Does NOT replace the enforcement officer. Generates objective, tamper-evident digital findings to accelerate field seizure decisions.")
    ]
    for ititle, idesc in innov_points:
        pi = tf_in.add_paragraph()
        pi.text = f"★ {ititle} "
        pi.font.size = Pt(8.5)
        pi.font.bold = True
        pi.font.color.rgb = c_navy
        pi_d = tf_in.add_paragraph()
        pi_d.text = f"   {idesc}"
        pi_d.font.size = Pt(8)
        pi_d.font.color.rgb = c_dark

    # Card 3: Real Test Case Evidence Visualizer (Right)
    card_test = add_card(slide2, Inches(8.9), Inches(1.65), Inches(4.0), Inches(5.35), c_white, c_border)
    tf_t = card_test.text_frame
    tf_t.word_wrap = True
    p = tf_t.paragraphs[0]
    p.text = "PROTOTYPE TEST SHOWCASE"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = c_navy

    p_sub = tf_t.add_paragraph()
    p_sub.text = "Amul Taaza Toned Milk (1 L Pouch)"
    p_sub.font.size = Pt(9)
    p_sub.font.bold = True
    p_sub.font.color.rgb = c_red

    # Try inserting test image if present
    if os.path.exists(img_amul_front):
        try:
            slide2.shapes.add_picture(img_amul_front, Inches(9.2), Inches(2.35), width=Inches(1.6))
        except Exception:
            pass

    if os.path.exists(img_amul_back):
        try:
            slide2.shapes.add_picture(img_amul_back, Inches(11.0), Inches(2.35), width=Inches(1.6))
        except Exception:
            pass

    # Findings text box below images
    f_box = slide2.shapes.add_textbox(Inches(9.0), Inches(4.2), Inches(3.8), Inches(2.7))
    tf_fb = f_box.text_frame
    tf_fb.word_wrap = True
    
    findings = [
        ("Overall Status:", "NON-COMPLIANT (Score: 72/100)", c_red),
        ("Rule 7 Violation:", "MRP numeral height is 2.2mm. Mandated minimum under Table I for >500ml is 4.0mm.", c_red),
        ("Rule 6(2) Warning:", "Toll-free phone present, but mandatory consumer care email missing.", c_gold),
        ("Rule 32 Penalty:", "Compounding fine calculated: Rs. 2,000.", c_navy),
        ("Form Generated:", "Seventh Schedule Form B (Volume Checking Sheet) ready with 1-click download.", c_green)
    ]
    for flabel, fval, fcolor in findings:
        pf = tf_fb.add_paragraph()
        pf.text = f"• {flabel} "
        pf.font.size = Pt(8)
        pf.font.bold = True
        pf.font.color.rgb = fcolor
        pf_val = tf_fb.add_paragraph()
        pf_val.text = f"   {fval}"
        pf_val.font.size = Pt(7.5)
        pf_val.font.color.rgb = c_dark

    # =========================================================================
    # SLIDE 3: TECHNICAL APPROACH
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_common_header(slide3, "TECHNICAL APPROACH", "Technologies Used • Methodology & Architecture • Working Prototype")

    p_box = slide3.shapes.add_textbox(Inches(0.4), Inches(1.2), Inches(12.5), Inches(0.4))
    tf_pb = p_box.text_frame
    p_req = tf_pb.paragraphs[0]
    p_req.text = "❖ Technologies to be used (programming languages, frameworks, hardware)  •  Methodology and process flow"
    p_req.font.size = Pt(10.5)
    p_req.font.bold = True
    p_req.font.color.rgb = c_sih_blue

    # Card 1: 5-Tier Architecture (Left)
    card_arch = add_card(slide3, Inches(0.4), Inches(1.65), Inches(7.5), Inches(5.35), c_white, c_navy)
    tf_a = card_arch.text_frame
    tf_a.word_wrap = True
    p = tf_a.paragraphs[0]
    p.text = "5-TIER LAYERED SYSTEM ARCHITECTURE"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = c_navy

    tiers = [
        ("Tier 1: Field Client Presentation Layer", "Responsive PWA & Mobile App with on-screen PDP guides, torch toggle, and local offline cache."),
        ("Tier 2: Pre-Processing & Quality Filter", "HTML5 Canvas luminance leveling, contrast stretching, and Laplacian blur variance test (warns if blurry)."),
        ("Tier 3: Vision & Legal Entity Extraction", "Prototype: Gemini Multimodal Vision API. Production: Sovereign Document AI / OCR hosted on NIC MeghRaj."),
        ("Tier 4: Deterministic Statutory Rules Engine", "Pure rule service validating Rules 6, 7, 8, 9, 10, 13, 18, 22, and Schedules I & II with zero hallucination."),
        ("Tier 5: Evidence, Dossier & Repository", "Client-side jsPDF compiles Seventh Schedule Form A & B sheets. LocalStorage + Cloud Firestore synchronization.")
    ]
    for ttitle, tdesc in tiers:
        pt = tf_a.add_paragraph()
        pt.text = f"■ {ttitle}"
        pt.font.size = Pt(8.5)
        pt.font.bold = True
        pt.font.color.rgb = c_teal
        pt_d = tf_a.add_paragraph()
        pt_d.text = f"    {tdesc}"
        pt_d.font.size = Pt(8)
        pt_d.font.color.rgb = c_dark

    # Card 2: Tech Stack Matrix (Top Right)
    card_tech = add_card(slide3, Inches(8.1), Inches(1.65), Inches(4.8), Inches(2.6), c_light_bg, c_sih_blue)
    tf_tc = card_tech.text_frame
    tf_tc.word_wrap = True
    p = tf_tc.paragraphs[0]
    p.text = "TECHNOLOGY STACK MAPPING"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = c_sih_blue

    stacks = [
        ("Frontend Client:", "React 19, TypeScript, Vite, Tailwind CSS v4, Lucide"),
        ("Offline Edge OCR:", "Tesseract.js Web Worker + HTML5 Canvas Pre-processing"),
        ("Multimodal Vision:", "Google Gemini Vision (Prototype) ➔ Sovereign NIC AI (Final)"),
        ("Statutory Dossier:", "jsPDF + jsPDF-AutoTable (Official Form A & B generator)"),
        ("Data Persistence:", "IndexedDB / LocalStorage (Local-First) + Cloud Firestore")
    ]
    for slabel, sval in stacks:
        ps = tf_tc.add_paragraph()
        ps.text = f"• {slabel} "
        ps.font.size = Pt(8)
        ps.font.bold = True
        ps.font.color.rgb = c_navy
        ps_v = tf_tc.add_paragraph()
        ps_v.text = f"   {sval}"
        ps_v.font.size = Pt(7.5)
        ps_v.font.color.rgb = c_dark

    # Card 3: Statutory Rule Coverage (Bottom Right)
    card_rules = add_card(slide3, Inches(8.1), Inches(4.4), Inches(4.8), Inches(2.6), c_white, c_teal)
    tf_rc = card_rules.text_frame
    tf_rc.word_wrap = True
    p = tf_rc.paragraphs[0]
    p.text = "STATUTORY LEGAL RULES CODIFIED"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = c_teal

    rules_codified = [
        ("Rule 6(1)(a-g):", "Mandatory Name, Address, Net Qty, Dates, MRP, Batch"),
        ("Rule 7 Table I:", "Minimum numeral height based on net quantity & PDP area"),
        ("Rule 13(4-5):", "Strict SI units: g, kg, ml, l. Blocks 'gm', 'gms', 'dozen'"),
        ("Rule 18(5):", "Detects unauthorized price stickers, smudging & dual pricing"),
        ("Second Schedule:", "Validates mandatory standard pack sizes across 19 categories"),
        ("First Schedule:", "Calculates Maximum Permissible Error (MPE) allowable deficiency")
    ]
    for rlabel, rval in rules_codified:
        pr = tf_rc.add_paragraph()
        pr.text = f"✔ {rlabel} "
        pr.font.size = Pt(7.8)
        pr.font.bold = True
        pr.font.color.rgb = c_navy
        pr_v = tf_rc.add_paragraph()
        pr_v.text = f"    {rval}"
        pr_v.font.size = Pt(7.3)
        pr_v.font.color.rgb = c_dark

    # =========================================================================
    # SLIDE 4: FEASIBILITY AND VIABILITY
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_common_header(slide4, "FEASIBILITY AND VIABILITY", "Feasibility Analysis • Field Challenges & Risks • Engineered Mitigations")

    p_box = slide4.shapes.add_textbox(Inches(0.4), Inches(1.2), Inches(12.5), Inches(0.4))
    tf_pb = p_box.text_frame
    p_req = tf_pb.paragraphs[0]
    p_req.text = "❖ Analysis of feasibility  •  Potential challenges and risks  •  Strategies for overcoming these challenges"
    p_req.font.size = Pt(10.5)
    p_req.font.bold = True
    p_req.font.color.rgb = c_sih_blue

    # 3 Feasibility Pillar Cards (Top)
    pillars = [
        ("TECHNICAL FEASIBILITY", [
            "Runs on standard smartphones & tablets.",
            "No proprietary optical or laser hardware needed.",
            "Dual-engine: Cloud Vision + 100% offline edge OCR.",
            "Deterministic rule engine prevents AI hallucinations."
        ], c_navy),
        ("OPERATIONAL FEASIBILITY", [
            "Intuitive 3-step officer workflow: Aim ➔ Scan ➔ Dossier.",
            "On-screen bounding boxes enable instant visual review.",
            "Eliminates 20+ mins of manual measuring & paperwork.",
            "Outputs official Seventh Schedule Form A/B sheets."
        ], c_teal),
        ("ECONOMIC & ROLLOUT VIABILITY", [
            "Zero new field hardware expenditure (CapEx).",
            "Officers use existing government mobile devices.",
            "Phased rollout: State retail pilot ➔ Pan-India.",
            "Massive cost & time savings across inspection zones."
        ], c_sih_blue)
    ]

    for idx, (ptitle, ppoints, pcolor) in enumerate(pillars):
        c_x = Inches(0.4 + idx * 4.2)
        c_card = add_card(slide4, c_x, Inches(1.65), Inches(4.0), Inches(2.4), c_white, pcolor)
        tf_p = c_card.text_frame
        tf_p.word_wrap = True
        p = tf_p.paragraphs[0]
        p.text = ptitle
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = pcolor

        for pt_text in ppoints:
            p_pt = tf_p.add_paragraph()
            p_pt.text = f"• {pt_text}"
            p_pt.font.size = Pt(8)
            p_pt.font.color.rgb = c_dark

    # 4 Challenge -> Mitigation Cards (Bottom)
    card_mit = add_card(slide4, Inches(0.4), Inches(4.2), Inches(12.5), Inches(2.8), c_light_bg, c_navy)
    tf_m = card_mit.text_frame
    tf_m.word_wrap = True
    p = tf_m.paragraphs[0]
    p.text = "REAL-WORLD FIELD CHALLENGES & DEMONSTRATED MITIGATIONS"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = c_navy

    challenges = [
        ("Poor Lighting & Blurry Photos", "Low retail lighting or shaky hands cause OCR failure.", "Laplacian gradient sharpness filter tests image clarity on HTML5 canvas before running extraction. Warns officer if blurry."),
        ("Zero Network in Rural Mandis", "Field inspections occur in remote godowns without 4G/5G.", "Client-side Tesseract.js Web Worker + LocalStorage vault enables 100% offline inspection and queue-based cloud sync."),
        ("Curved & Crinkled Packaging", "Labels on pouches and bottles wrap around edges.", "Multi-view panel acquisition (Front, Back, Side) segments text across multiple views, preserving label integrity."),
        ("Changing Gazette Rules & Fines", "Legal metrology rules and compounding fines evolve over time.", "Dynamic Rule Configuration Engine allows departmental administrators to update fines, rules, and schedules without rewriting software.")
    ]

    for ch_title, ch_prob, ch_sol in challenges:
        p_ch = tf_m.add_paragraph()
        p_ch.text = f"⚠ {ch_title} ──► "
        p_ch.font.size = Pt(8.5)
        p_ch.font.bold = True
        p_ch.font.color.rgb = c_red
        
        # append solution
        p_sol = tf_m.add_paragraph()
        p_sol.text = f"    Problem: {ch_prob} | Solution: {ch_sol}"
        p_sol.font.size = Pt(7.8)
        p_sol.font.color.rgb = c_dark

    # =========================================================================
    # SLIDE 5: IMPACT AND BENEFITS
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    add_common_header(slide5, "IMPACT AND BENEFITS", "Stakeholder Impacts • Workflow Comparison • Before vs. After")

    p_box = slide5.shapes.add_textbox(Inches(0.4), Inches(1.2), Inches(12.5), Inches(0.4))
    tf_pb = p_box.text_frame
    p_req = tf_pb.paragraphs[0]
    p_req.text = "❖ Potential impact on the target audience  •  Benefits of the solution (social, economic, environmental, etc.)"
    p_req.font.size = Pt(10.5)
    p_req.font.bold = True
    p_req.font.color.rgb = c_sih_blue

    # 4-Quadrant Stakeholder Impacts (Left)
    card_stk = add_card(slide5, Inches(0.4), Inches(1.65), Inches(6.0), Inches(5.35), c_white, c_navy)
    tf_s = card_stk.text_frame
    tf_s.word_wrap = True
    p = tf_s.paragraphs[0]
    p.text = "MULTI-STAKEHOLDER IMPACT ECOSYSTEM"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = c_navy

    stakeholders = [
        ("👮 FOR LEGAL METROLOGY OFFICERS", [
            "Reduces inspection time from 25 mins to under 60 seconds.",
            "Eliminates manual letter-height calipers & handwritten forms.",
            "Provides court-ready Seventh Schedule Form A & B dossiers."
        ], c_sih_blue),
        ("🛒 FOR CONSUMERS & CITIZENS", [
            "Protects against stealth shrinkflation & non-standard pack sizes.",
            "Eliminates unauthorized sticker price hikes & hidden dual pricing.",
            "1-tap grievance filing to National Consumer Helpline (NCH 1915)."
        ], c_teal),
        ("🏭 FOR FMCG BRANDS & PACKERS", [
            "Brand Pre-Check Portal audits artwork before printing wrappers.",
            "Prevents expensive market product seizures and packaging recalls.",
            "Promotes transparent, standardized compliance across the supply chain."
        ], c_gold),
        ("🏛️ FOR MINISTRY & DIRECTORATE", [
            "National Surveillance Hub aggregates state-wise violation trends.",
            "Identifies repeat offender brands and high-risk commodity classes.",
            "Empowers data-driven policy amendments with empirical evidence."
        ], c_navy)
    ]

    for stitle, spoints, scolor in stakeholders:
        pst = tf_s.add_paragraph()
        pst.text = stitle
        pst.font.size = Pt(8.5)
        pst.font.bold = True
        pst.font.color.rgb = scolor
        for pt_text in spoints:
            ppt = tf_s.add_paragraph()
            ppt.text = f"  • {pt_text}"
            ppt.font.size = Pt(7.8)
            ppt.font.color.rgb = c_dark

    # Comparison Table: Manual vs INSPACK (Right)
    card_cmp = add_card(slide5, Inches(6.6), Inches(1.65), Inches(6.3), Inches(5.35), c_light_bg, c_sih_blue)
    tf_c = card_cmp.text_frame
    tf_c.word_wrap = True
    p = tf_c.paragraphs[0]
    p.text = "WORKFLOW COMPARISON: MANUAL VS. INSPACK"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = c_sih_blue

    comparisons = [
        ("Information Capture", "Manual inspection with magnifying glass & ruler (Slow, visual fatigue)", "Automated multi-panel photo capture (Front, Back, Side)"),
        ("Rule Verification", "Cross-referencing multiple gazette books & tables manually", "Instant deterministic rule validation across all LMPC clauses"),
        ("Numeral Height Check", "Manual measurement with plastic calipers (Subjective)", "Automated comparison against Table I minimum standards"),
        ("Tampered Price Check", "Hard to detect subtle sticker alterations in dim lighting", "Automated detection of glued price stickers & dual pricing (Rule 18)"),
        ("Pack Size Audit", "Officer memorizes allowed sizes across 19 categories", "Instant validation against Second Schedule standard pack sizes"),
        ("Report Preparation", "Handwritten Form A/B sheets & seizure memos (20-30 mins)", "Instant 1-click Seventh Schedule Form A/B PDF (< 60 secs)")
    ]

    for param, manual, inspack in comparisons:
        pcm = tf_c.add_paragraph()
        pcm.text = f"◈ {param}:"
        pcm.font.size = Pt(8)
        pcm.font.bold = True
        pcm.font.color.rgb = c_navy

        pcm_m = tf_c.add_paragraph()
        pcm_m.text = f"   Manual: {manual}"
        pcm_m.font.size = Pt(7.3)
        pcm_m.font.color.rgb = c_red

        pcm_i = tf_c.add_paragraph()
        pcm_i.text = f"   INSPACK: {inspack}"
        pcm_i.font.size = Pt(7.3)
        pcm_i.font.color.rgb = c_green

    # =========================================================================
    # SLIDE 6: RESEARCH AND REFERENCES
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    add_common_header(slide6, "RESEARCH AND REFERENCES", "Statutory Frameworks • Schedules & Forms • Evidence Standards • Live Prototype")

    p_box = slide6.shapes.add_textbox(Inches(0.4), Inches(1.2), Inches(12.5), Inches(0.4))
    tf_pb = p_box.text_frame
    p_req = tf_pb.paragraphs[0]
    p_req.text = "❖ Details / Links of the reference and research work  •  Authentic Statutory Foundations"
    p_req.font.size = Pt(10.5)
    p_req.font.bold = True
    p_req.font.color.rgb = c_sih_blue

    # 4 Quadrants of Regulatory Authority
    quads = [
        ("📜 STATUTORY ACTS & LEGISLATION", [
            ("The Legal Metrology Act, 2009 (Act No. 1 of 2010):", "Statutory authority for powers of inspection, search & seizure (Sec 15), non-standard package penalties (Sec 36), and compounding of offences (Sec 48)."),
            ("LMPC Rules, 2011 (Gazette of India):", "Comprehensive statutory code prescribing mandatory package declarations, Principal Display Panel geometry, and enforcement schedules."),
            ("GSR 779(E) & 2021 Amendments:", "Mandated statutory Unit Sale Price (USP) declarations and e-commerce digital display requirements on dark store platforms.")
        ], c_navy),
        ("📑 SCHEDULES & PRESCRIBED FORMS", [
            ("Seventh Schedule [Rule 19(2)] - Form A:", "Official statutory format for Weight Checking Data Sheet, tare calculation, and tripartite signatures."),
            ("Seventh Schedule [Rule 19(2)] - Form B:", "Official statutory format for Volume and Measure Checking Data Sheet for liquid/fluid commodities."),
            ("Second Schedule [Rule 5]:", "Mandatory standard packaging quantities across 19 commodity classes (Biscuits, Edible Oils, Tea, Rice, etc.)."),
            ("First Schedule [Rules 2(e) & 22]:", "Maximum Permissible Error (MPE) allowable deficiency tolerance tables.")
        ], c_teal),
        ("⚖️ ELECTRONIC EVIDENCE & ADMISSIBILITY", [
            ("Section 65B Indian Evidence Act / BSA 2023:", "Prescribes statutory certification for electronic records, cryptographic SHA-256 hash preservation, and tamper-evident image logs."),
            ("W3C Canvas & Web Worker Standards:", "Authoritative open web standards powering 100% offline, on-device image contrast optimization and edge OCR processing."),
            ("FSSAI Packaging Regulations, 2018:", "Cross-referenced for front-of-pack synthetic color and artificial sweetener statutory warnings.")
        ], c_sih_blue),
        ("🌐 HACKATHON ALIGNMENT & LIVE PROTOTYPE", [
            ("SIH 2026 Problem Statement ID:", "SIH-26034 (Ministry of Consumer Affairs, Food & Public Distribution — Legal Metrology Division)."),
            ("Functional Live Web Prototype:", "https://inspacknksih2026.vercel.app/ (Tested with benchmark retail commodities)."),
            ("SIH Implementation Guidelines:", "Grounded in government deployment maturity, open-source compliance, and sovereign data privacy standards.")
        ], c_gold)
    ]

    for q_idx, (q_title, q_items, q_color) in enumerate(quads):
        row = q_idx // 2
        col = q_idx % 2
        qx = Inches(0.4 + col * 6.3)
        qy = Inches(1.65 + row * 2.65)
        
        q_card = add_card(slide6, qx, qy, Inches(6.1), Inches(2.5), c_white, q_color)
        tf_q = q_card.text_frame
        tf_q.word_wrap = True
        p = tf_q.paragraphs[0]
        p.text = q_title
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = q_color

        for item_label, item_desc in q_items:
            pi_l = tf_q.add_paragraph()
            pi_l.text = f"• {item_label} "
            pi_l.font.size = Pt(7.8)
            pi_l.font.bold = True
            pi_l.font.color.rgb = c_navy
            pi_d = tf_q.add_paragraph()
            pi_d.text = f"   {item_desc}"
            pi_d.font.size = Pt(7.2)
            pi_d.font.color.rgb = c_dark

    # Save PPTX presentation
    output_pptx = os.path.join(base_dir, "INSPACK_SIH2026_Idea_Presentation.pptx")
    prs.save(output_pptx)
    print(f"Successfully generated PowerPoint presentation: {output_pptx}")
    print(f"Total Slides: {len(prs.slides)}")

if __name__ == "__main__":
    create_presentation()
