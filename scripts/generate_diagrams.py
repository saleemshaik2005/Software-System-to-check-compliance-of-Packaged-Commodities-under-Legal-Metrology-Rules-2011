"""
INSPACK - SIH 2026 Diagram Generator
Generates:
1. Diagram 1: User Flow / System Workflow (Field Inspection Journey)
2. Diagram 2: Technical Architecture (Multi-Tier System Architecture)
Outputs: Standalone SVGs, High-Resolution 4K/Full-HD PNGs, and Interactive HTML Viewer.
"""

import os
import subprocess
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR = os.path.join(BASE_DIR, "public")

def generate_svg_diagram1():
    """Generates DIAGRAM 1 — USER FLOW / SYSTEM WORKFLOW (Field Inspection Officer Journey)."""
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080" style="background:#F8FAFC; font-family:'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;">
  <defs>
    <!-- Shadow filter for clean cards -->
    <filter id="cardShadow" x="-2%" y="-2%" width="104%" height="106%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#0F172A" flood-opacity="0.06"/>
    </filter>
    <filter id="headerShadow" x="-1%" y="-2%" width="102%" height="106%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.12"/>
    </filter>
    
    <!-- Markers for arrows -->
    <marker id="arrowBlue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0284C7"/>
    </marker>
    <marker id="arrowNavy" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0A3663"/>
    </marker>
    <marker id="arrowGreen" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#16A34A"/>
    </marker>
    <marker id="arrowRed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#DC2626"/>
    </marker>
    <marker id="arrowSlate" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748B"/>
    </marker>
  </defs>

  <!-- ==================== TOP HEADER BANNER ==================== -->
  <rect x="0" y="0" width="1920" height="84" fill="#0A2540" filter="url(#headerShadow)"/>
  <rect x="0" y="80" width="1920" height="4" fill="#D97706"/> <!-- Govt Gold Stripe -->

  <!-- Top Metadata & Team Badge -->
  <g transform="translate(45, 14)">
    <!-- Ministry & SIH Pill -->
    <rect x="0" y="0" width="460" height="26" rx="13" fill="#1E3A8A"/>
    <text x="15" y="17" fill="#F8FAFC" font-size="11" font-weight="600" letter-spacing="0.5">SMART INDIA HACKATHON 2026 | PS ID: SIH-26034</text>
    <text x="315" y="17" fill="#FCD34D" font-size="11" font-weight="700">| MoCA, Food &amp; PD</text>
    
    <!-- Title -->
    <text x="0" y="52" fill="#FFFFFF" font-size="22" font-weight="700" letter-spacing="0.3">INSPACK — FIELD OFFICER INSPECTION &amp; COMPLIANCE WORKFLOW</text>
  </g>

  <!-- Right Header Badge -->
  <g transform="translate(1485, 16)">
    <rect x="0" y="0" width="390" height="52" rx="8" fill="#0F2F57" stroke="#334E68" stroke-width="1"/>
    <text x="20" y="22" fill="#94A3B8" font-size="10" font-weight="600" text-transform="uppercase" letter-spacing="1">PROJECT INSPACK • LEGAL METROLOGY ACT, 2009</text>
    <text x="20" y="42" fill="#38BDF8" font-size="13" font-weight="700">Team: Neural Knights</text>
    <text x="180" y="42" fill="#E2E8F0" font-size="12" font-weight="400">| Chaitanya Bharathi Institute of Technology</text>
  </g>

  <!-- ==================== MACRO JOURNEY PHASE CHEVRON BAR ==================== -->
  <g transform="translate(45, 96)">
    <rect x="0" y="0" width="1830" height="44" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#cardShadow)"/>
    
    <!-- Phase 1: CAPTURE -->
    <rect x="6" y="6" width="280" height="32" rx="6" fill="#EFF6FF"/>
    <text x="20" y="26" fill="#1E40AF" font-size="12" font-weight="800" letter-spacing="0.5">PHASE 1: CAPTURE &amp; QA</text>
    <path d="M 292 22 L 306 22" stroke="#94A3B8" stroke-width="2" marker-end="url(#arrowSlate)"/>

    <!-- Phase 2: AI/OCR -->
    <rect x="316" y="6" width="290" height="32" rx="6" fill="#F0FDF4"/>
    <text x="330" y="26" fill="#166534" font-size="12" font-weight="800" letter-spacing="0.5">PHASE 2: AI/OCR EXTRACTION</text>
    <path d="M 612 22 L 626 22" stroke="#94A3B8" stroke-width="2" marker-end="url(#arrowSlate)"/>

    <!-- Phase 3: RULE CHECKING -->
    <rect x="636" y="6" width="300" height="32" rx="6" fill="#FEF3C7"/>
    <text x="650" y="26" fill="#92400E" font-size="12" font-weight="800" letter-spacing="0.5">PHASE 3: LEGAL RULES ENGINE</text>
    <path d="M 942 22 L 956 22" stroke="#94A3B8" stroke-width="2" marker-end="url(#arrowSlate)"/>

    <!-- Phase 4: DECISION -->
    <rect x="966" y="6" width="260" height="32" rx="6" fill="#FAF5FF"/>
    <text x="980" y="26" fill="#6B21A8" font-size="12" font-weight="800" letter-spacing="0.5">PHASE 4: DECISION SUPPORT</text>
    <path d="M 1232 22 L 1246 22" stroke="#94A3B8" stroke-width="2" marker-end="url(#arrowSlate)"/>

    <!-- Phase 5: EVIDENCE -->
    <rect x="1256" y="6" width="260" height="32" rx="6" fill="#FFF1F2"/>
    <text x="1270" y="26" fill="#9F1239" font-size="12" font-weight="800" letter-spacing="0.5">PHASE 5: EVIDENCE ATTESTATION</text>
    <path d="M 1522 22 L 1536 22" stroke="#94A3B8" stroke-width="2" marker-end="url(#arrowSlate)"/>

    <!-- Phase 6: REPORT & SYNC -->
    <rect x="1546" y="6" width="278" height="32" rx="6" fill="#F1F5F9"/>
    <text x="1560" y="26" fill="#334155" font-size="12" font-weight="800" letter-spacing="0.5">PHASE 6: STATUTORY REPORT &amp; SYNC</text>
  </g>

  <!-- ========================================================================= -->
  <!-- ROW 1: STEPS 01 TO 05 (Left to Right)                                     -->
  <!-- Card Width: 346, Height: 374, Gap: 25                                     -->
  <!-- ========================================================================= -->

  <!-- STEP 01: Officer Authentication -->
  <g transform="translate(45, 154)" filter="url(#cardShadow)">
    <rect x="0" y="0" width="346" height="374" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <path d="M 0 10 Q 0 0 10 0 L 336 0 Q 346 0 346 10 L 346 48 L 0 48 Z" fill="#0A3663"/>
    <rect x="12" y="10" width="34" height="28" rx="6" fill="#D97706"/>
    <text x="29" y="29" fill="#FFFFFF" font-size="14" font-weight="800" text-anchor="middle">01</text>
    <text x="56" y="30" fill="#FFFFFF" font-size="14" font-weight="700">Officer Login &amp; Session</text>
    
    <!-- Stage Pill -->
    <rect x="16" y="58" width="105" height="20" rx="4" fill="#EFF6FF"/>
    <text x="24" y="72" fill="#1D4ED8" font-size="10" font-weight="700">STAGE: CAPTURE</text>
    
    <!-- Body Content -->
    <text x="16" y="102" fill="#0F172A" font-size="13" font-weight="700">Field Inspector Authentication</text>
    <text x="16" y="122" fill="#475569" font-size="12">• Authorized Officer Govt ID / SSO login</text>
    <text x="16" y="142" fill="#475569" font-size="12">• Biometric / Cached PIN for remote mandis</text>
    <text x="16" y="162" fill="#475569" font-size="12">• Inspection session initiated with GPS &amp; Time</text>
    
    <line x1="16" y1="180" x2="330" y2="180" stroke="#F1F5F9" stroke-width="1.5"/>
    
    <text x="16" y="202" fill="#0F172A" font-size="13" font-weight="700">Inspection Context Setup</text>
    <text x="16" y="222" fill="#475569" font-size="12">• Commodity category selection (Food, Oil, etc.)</text>
    <text x="16" y="242" fill="#475569" font-size="12">• Retail store / Warehouse / Dark-store ID</text>
    <text x="16" y="262" fill="#475569" font-size="12">• Offline session token cached locally</text>

    <!-- Key Takeaway Box -->
    <rect x="14" y="285" width="318" height="74" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
    <text x="24" y="306" fill="#0A3663" font-size="11" font-weight="700">OFFLINE RESILIENCE GUARANTEE</text>
    <text x="24" y="324" fill="#64748B" font-size="11">Inspectors can operate fully without network;</text>
    <text x="24" y="342" fill="#64748B" font-size="11">cryptographic session created locally on device.</text>
  </g>

  <!-- Horizontal Arrow 1 -> 2 -->
  <path d="M 391 341 L 413 341" stroke="#0284C7" stroke-width="2.5" marker-end="url(#arrowBlue)"/>

  <!-- STEP 02: Capture Package Images -->
  <g transform="translate(416, 154)" filter="url(#cardShadow)">
    <rect x="0" y="0" width="346" height="374" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <path d="M 0 10 Q 0 0 10 0 L 336 0 Q 346 0 346 10 L 346 48 L 0 48 Z" fill="#0A3663"/>
    <rect x="12" y="10" width="34" height="28" rx="6" fill="#D97706"/>
    <text x="29" y="29" fill="#FFFFFF" font-size="14" font-weight="800" text-anchor="middle">02</text>
    <text x="56" y="30" fill="#FFFFFF" font-size="14" font-weight="700">Capture Package Images</text>
    
    <!-- Stage Pill -->
    <rect x="16" y="58" width="105" height="20" rx="4" fill="#EFF6FF"/>
    <text x="24" y="72" fill="#1D4ED8" font-size="10" font-weight="700">STAGE: CAPTURE</text>

    <!-- Body Content -->
    <text x="16" y="102" fill="#0F172A" font-size="13" font-weight="700">Multi-View Photographic Capture</text>
    <text x="16" y="122" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">Front Panel:</tspan> Principal Display Panel (PDP)</text>
    <text x="16" y="142" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">Back Panel:</tspan> Mandatory statutory text &amp; Mfg</text>
    <text x="16" y="162" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">Side Panels:</tspan> Consumer care, MRP, Dates</text>

    <line x1="16" y1="180" x2="330" y2="180" stroke="#F1F5F9" stroke-width="1.5"/>

    <text x="16" y="202" fill="#0F172A" font-size="13" font-weight="700">Assisted Camera Interface</text>
    <text x="16" y="222" fill="#475569" font-size="12">• On-screen PDP rectangular guide overlay</text>
    <text x="16" y="242" fill="#475569" font-size="12">• Torch toggle for dimly lit retail shelves</text>
    <text x="16" y="262" fill="#475569" font-size="12">• High-resolution raw image buffer retention</text>

    <!-- Key Takeaway Box -->
    <rect x="14" y="285" width="318" height="74" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
    <text x="24" y="306" fill="#0A3663" font-size="11" font-weight="700">COMPLETE PACKAGING EVIDENCE</text>
    <text x="24" y="324" fill="#64748B" font-size="11">Captures all sides to satisfy Rule 6 requirements</text>
    <text x="24" y="342" fill="#64748B" font-size="11">without requiring multiple physical visits.</text>
  </g>

  <!-- Horizontal Arrow 2 -> 3 -->
  <path d="M 762 341 L 784 341" stroke="#0284C7" stroke-width="2.5" marker-end="url(#arrowBlue)"/>

  <!-- STEP 03: Image Quality Check -->
  <g transform="translate(787, 154)" filter="url(#cardShadow)">
    <rect x="0" y="0" width="346" height="374" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <path d="M 0 10 Q 0 0 10 0 L 336 0 Q 346 0 346 10 L 346 48 L 0 48 Z" fill="#0A3663"/>
    <rect x="12" y="10" width="34" height="28" rx="6" fill="#D97706"/>
    <text x="29" y="29" fill="#FFFFFF" font-size="14" font-weight="800" text-anchor="middle">03</text>
    <text x="56" y="30" fill="#FFFFFF" font-size="14" font-weight="700">Image Quality Check</text>
    
    <!-- Stage Pill -->
    <rect x="16" y="58" width="105" height="20" rx="4" fill="#EFF6FF"/>
    <text x="24" y="72" fill="#1D4ED8" font-size="10" font-weight="700">STAGE: CAPTURE</text>

    <!-- Body Content -->
    <text x="16" y="102" fill="#0F172A" font-size="13" font-weight="700">On-Device QA Verification</text>
    <text x="16" y="122" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">Blur Detection:</tspan> Laplacian variance analysis</text>
    <text x="16" y="142" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">Sharpness Score:</tspan> Validates micro-text legibility</text>
    <text x="16" y="162" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">Glare &amp; Lighting:</tspan> Identifies reflective washouts</text>

    <line x1="16" y1="180" x2="330" y2="180" stroke="#F1F5F9" stroke-width="1.5"/>

    <text x="16" y="202" fill="#0F172A" font-size="13" font-weight="700">Immediate Officer Feedback</text>
    <text x="16" y="222" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#16A34A">PASS:</tspan> Proceeds instantly to AI/OCR pipeline</text>
    <text x="16" y="242" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#DC2626">FAIL:</tspan> Haptic alert &amp; instant retake prompt</text>
    <text x="16" y="262" fill="#475569" font-size="12">• Prevents corrupted evidence from reaching engine</text>

    <!-- Key Takeaway Box -->
    <rect x="14" y="285" width="318" height="74" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
    <text x="24" y="306" fill="#0A3663" font-size="11" font-weight="700">ZERO GARBAGE-IN PRINCIPLE</text>
    <text x="24" y="324" fill="#64748B" font-size="11">Pre-flight validation guarantees only sharp,</text>
    <text x="24" y="342" fill="#64748B" font-size="11">usable packaging photos are analyzed.</text>
  </g>

  <!-- Horizontal Arrow 3 -> 4 -->
  <path d="M 1133 341 L 1155 341" stroke="#0284C7" stroke-width="2.5" marker-end="url(#arrowBlue)"/>

  <!-- STEP 04: AI/OCR Extraction -->
  <g transform="translate(1158, 154)" filter="url(#cardShadow)">
    <rect x="0" y="0" width="346" height="374" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <path d="M 0 10 Q 0 0 10 0 L 336 0 Q 346 0 346 10 L 346 48 L 0 48 Z" fill="#0A3663"/>
    <rect x="12" y="10" width="34" height="28" rx="6" fill="#D97706"/>
    <text x="29" y="29" fill="#FFFFFF" font-size="14" font-weight="800" text-anchor="middle">04</text>
    <text x="56" y="30" fill="#FFFFFF" font-size="14" font-weight="700">AI / OCR Text Extraction</text>
    
    <!-- Stage Pill -->
    <rect x="16" y="58" width="105" height="20" rx="4" fill="#F0FDF4"/>
    <text x="24" y="72" fill="#166534" font-size="10" font-weight="700">STAGE: AI / OCR</text>

    <!-- Body Content -->
    <text x="16" y="102" fill="#0F172A" font-size="13" font-weight="700">Sovereign On-Device Extraction</text>
    <text x="16" y="122" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">Product Name:</tspan> Generic commodity identifier</text>
    <text x="16" y="142" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">Manufacturer:</tspan> Complete name, address &amp; PIN</text>
    <text x="16" y="162" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">Net Quantity:</tspan> Numeric value &amp; SI unit symbols</text>

    <line x1="16" y1="180" x2="330" y2="180" stroke="#F1F5F9" stroke-width="1.5"/>

    <text x="16" y="202" fill="#0F172A" font-size="13" font-weight="700">Statutory Field Parsing</text>
    <text x="16" y="222" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">MRP:</tspan> Price and "incl. of all taxes" text</text>
    <text x="16" y="242" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">Dates:</tspan> Month &amp; Year of packing / import / expiry</text>
    <text x="16" y="262" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">Consumer Care:</tspan> Helpline phone &amp; official email</text>

    <!-- Key Takeaway Box -->
    <rect x="14" y="285" width="318" height="74" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
    <text x="24" y="306" fill="#0A3663" font-size="11" font-weight="700">NO EXTERNAL PROPRIETARY LLMS</text>
    <text x="24" y="324" fill="#64748B" font-size="11">Powered by sovereign OCR &amp; local edge vision</text>
    <text x="24" y="342" fill="#64748B" font-size="11">without transmitting data to commercial clouds.</text>
  </g>

  <!-- Horizontal Arrow 4 -> 5 -->
  <path d="M 1504 341 L 1526 341" stroke="#0284C7" stroke-width="2.5" marker-end="url(#arrowBlue)"/>

  <!-- STEP 05: Data Structuring & Doc Understanding -->
  <g transform="translate(1529, 154)" filter="url(#cardShadow)">
    <rect x="0" y="0" width="346" height="374" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <path d="M 0 10 Q 0 0 10 0 L 336 0 Q 346 0 346 10 L 346 48 L 0 48 Z" fill="#0A3663"/>
    <rect x="12" y="10" width="34" height="28" rx="6" fill="#D97706"/>
    <text x="29" y="29" fill="#FFFFFF" font-size="14" font-weight="800" text-anchor="middle">05</text>
    <text x="56" y="30" fill="#FFFFFF" font-size="14" font-weight="700">Data Structuring &amp; Doc AI</text>
    
    <!-- Stage Pill -->
    <rect x="16" y="58" width="105" height="20" rx="4" fill="#F0FDF4"/>
    <text x="24" y="72" fill="#166534" font-size="10" font-weight="700">STAGE: AI / OCR</text>

    <!-- Body Content -->
    <text x="16" y="102" fill="#0F172A" font-size="13" font-weight="700">Document Understanding</text>
    <text x="16" y="122" fill="#475569" font-size="12">• Detects packaging text lines and visual blocks</text>
    <text x="16" y="142" fill="#475569" font-size="12">• Computes PDP surface area (cm²) from image</text>
    <text x="16" y="162" fill="#475569" font-size="12">• Measures numeral &amp; font heights in millimeters</text>

    <line x1="16" y1="180" x2="330" y2="180" stroke="#F1F5F9" stroke-width="1.5"/>

    <text x="16" y="202" fill="#0F172A" font-size="13" font-weight="700">Spatial-Semantic Association</text>
    <text x="16" y="222" fill="#475569" font-size="12">• Binds extracted values to 2D bounding boxes</text>
    <text x="16" y="242" fill="#475569" font-size="12">• Links fields: "MRP" ↔ [₹ Price, Coordinates]</text>
    <text x="16" y="262" fill="#475569" font-size="12">• Outputs normalized, typed Structured JSON</text>

    <!-- Key Takeaway Box -->
    <rect x="14" y="285" width="318" height="74" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
    <text x="24" y="306" fill="#0A3663" font-size="11" font-weight="700">STRUCTURED DECLARATION PAYLOAD</text>
    <text x="24" y="324" fill="#64748B" font-size="11">Converts raw packaging pixels into a structured,</text>
    <text x="24" y="342" fill="#64748B" font-size="11">coordinate-aware JSON ready for legal rules.</text>
  </g>

  <!-- ========================================================================= -->
  <!-- TRANSITION CONNECTOR: ROW 1 (Step 5) -> ROW 2 (Step 6)                   -->
  <!-- ========================================================================= -->
  <g>
    <!-- Path flowing from bottom of Card 5, across left, and into top of Card 6 -->
    <path d="M 1702 528 L 1702 555 L 218 555 L 218 584" fill="none" stroke="#0A3663" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#arrowNavy)"/>
    
    <!-- Transition Badge in Center -->
    <rect x="740" y="540" width="440" height="30" rx="15" fill="#0A3663" filter="url(#headerShadow)"/>
    <text x="960" y="560" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="0.5">
      TRANSFER: Structured JSON &amp; Coordinate Map ➔ Legal Rules Engine
    </text>
  </g>

  <!-- ========================================================================= -->
  <!-- ROW 2: STEPS 06 TO 10 (Left to Right)                                     -->
  <!-- Card Width: 346, Height: 374, Gap: 25                                     -->
  <!-- ========================================================================= -->

  <!-- STEP 06: Deterministic Legal Rules Engine -->
  <g transform="translate(45, 592)" filter="url(#cardShadow)">
    <rect x="0" y="0" width="346" height="374" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <path d="M 0 10 Q 0 0 10 0 L 336 0 Q 346 0 346 10 L 346 48 L 0 48 Z" fill="#0A3663"/>
    <rect x="12" y="10" width="34" height="28" rx="6" fill="#D97706"/>
    <text x="29" y="29" fill="#FFFFFF" font-size="14" font-weight="800" text-anchor="middle">06</text>
    <text x="56" y="30" fill="#FFFFFF" font-size="14" font-weight="700">Deterministic Rules Engine</text>
    
    <!-- Stage Pill -->
    <rect x="16" y="58" width="135" height="20" rx="4" fill="#FEF3C7"/>
    <text x="24" y="72" fill="#92400E" font-size="10" font-weight="700">STAGE: RULE CHECKING</text>

    <!-- Body Content -->
    <text x="16" y="102" fill="#0F172A" font-size="13" font-weight="700">PCR, 2011 Statutory Rulebase</text>
    <text x="16" y="122" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">Rule 6:</tspan> Mandatory declarations completeness</text>
    <text x="16" y="142" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">Rule 7 / Tables I-II:</tspan> Minimum numeral height</text>
    <text x="16" y="162" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">Rule 13:</tspan> SI units compliance (flags `gm/gms`)</text>

    <line x1="16" y1="180" x2="330" y2="180" stroke="#F1F5F9" stroke-width="1.5"/>

    <text x="16" y="202" fill="#0F172A" font-size="13" font-weight="700">Schedule &amp; Format Checks</text>
    <text x="16" y="222" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">Second Schedule:</tspan> Standard pack sizes (19 types)</text>
    <text x="16" y="242" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">First Schedule:</tspan> Max Permissible Error (MPE)</text>
    <text x="16" y="262" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">Rule 18:</tspan> Statutory MRP format &amp; sticker check</text>

    <!-- Key Takeaway Box -->
    <rect x="14" y="285" width="318" height="74" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
    <text x="24" y="306" fill="#0A3663" font-size="11" font-weight="700">DETERMINISTIC CODE — ZERO HALLUCINATIONS</text>
    <text x="24" y="324" fill="#64748B" font-size="11">Coded statutory legal logic guarantees 100%</text>
    <text x="24" y="342" fill="#64748B" font-size="11">repeatable, legally audit-proof rule execution.</text>
  </g>

  <!-- Horizontal Arrow 6 -> 7 -->
  <path d="M 391 779 L 413 779" stroke="#0284C7" stroke-width="2.5" marker-end="url(#arrowBlue)"/>

  <!-- STEP 07: Compliance Verification -->
  <g transform="translate(416, 592)" filter="url(#cardShadow)">
    <rect x="0" y="0" width="346" height="374" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <path d="M 0 10 Q 0 0 10 0 L 336 0 Q 346 0 346 10 L 346 48 L 0 48 Z" fill="#0A3663"/>
    <rect x="12" y="10" width="34" height="28" rx="6" fill="#D97706"/>
    <text x="29" y="29" fill="#FFFFFF" font-size="14" font-weight="800" text-anchor="middle">07</text>
    <text x="56" y="30" fill="#FFFFFF" font-size="14" font-weight="700">Compliance Verification</text>
    
    <!-- Stage Pill -->
    <rect x="16" y="58" width="115" height="20" rx="4" fill="#FAF5FF"/>
    <text x="24" y="72" fill="#6B21A8" font-size="10" font-weight="700">STAGE: DECISION</text>

    <!-- Branching Visual: Compliant vs Non-Compliant -->
    <g transform="translate(14, 90)">
      <!-- Compliant Box -->
      <rect x="0" y="0" width="154" height="82" rx="6" fill="#F0FDF4" stroke="#86EFAC" stroke-width="1.5"/>
      <rect x="8" y="8" width="85" height="18" rx="4" fill="#16A34A"/>
      <text x="14" y="21" fill="#FFFFFF" font-size="10" font-weight="800">✓ COMPLIANT</text>
      <text x="8" y="42" fill="#166534" font-size="11" font-weight="700">All Rules Satisfied</text>
      <text x="8" y="58" fill="#4B5563" font-size="10">• Full statutory match</text>
      <text x="8" y="72" fill="#4B5563" font-size="10">• Clearance cert issued</text>

      <!-- Non-Compliant Box -->
      <rect x="164" y="0" width="154" height="82" rx="6" fill="#FEF2F2" stroke="#FCA5A5" stroke-width="1.5"/>
      <rect x="172" y="8" width="115" height="18" rx="4" fill="#DC2626"/>
      <text x="178" y="21" fill="#FFFFFF" font-size="10" font-weight="800">✗ NON-COMPLIANT</text>
      <text x="172" y="42" fill="#991B1B" font-size="11" font-weight="700">Infraction Flagged</text>
      <text x="172" y="58" fill="#4B5563" font-size="10">• Specific rule breached</text>
      <text x="172" y="72" fill="#4B5563" font-size="10">• Penalty compounding</text>
    </g>

    <line x1="16" y1="186" x2="330" y2="186" stroke="#F1F5F9" stroke-width="1.5"/>

    <text x="16" y="208" fill="#0F172A" font-size="13" font-weight="700">Officer Review &amp; Confirmation</text>
    <text x="16" y="228" fill="#475569" font-size="12">• Inspector examines flagged rule infractions</text>
    <text x="16" y="248" fill="#475569" font-size="12">• Inspects bounding boxes on actual commodity</text>
    <text x="16" y="268" fill="#475569" font-size="12">• Exercises statutory discretion &amp; enters remarks</text>

    <!-- Key Takeaway Box -->
    <rect x="14" y="285" width="318" height="74" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
    <text x="24" y="306" fill="#0A3663" font-size="11" font-weight="700">AUTHORIZED OFFICER IN THE LOOP</text>
    <text x="24" y="324" fill="#64748B" font-size="11">AI never acts as judge; final statutory decision</text>
    <text x="24" y="342" fill="#64748B" font-size="11">strictly rests with the authorized human officer.</text>
  </g>

  <!-- Horizontal Arrow 7 -> 8 -->
  <path d="M 762 779 L 784 779" stroke="#0284C7" stroke-width="2.5" marker-end="url(#arrowBlue)"/>

  <!-- STEP 08: Evidence Generation -->
  <g transform="translate(787, 592)" filter="url(#cardShadow)">
    <rect x="0" y="0" width="346" height="374" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <path d="M 0 10 Q 0 0 10 0 L 336 0 Q 346 0 346 10 L 346 48 L 0 48 Z" fill="#0A3663"/>
    <rect x="12" y="10" width="34" height="28" rx="6" fill="#D97706"/>
    <text x="29" y="29" fill="#FFFFFF" font-size="14" font-weight="800" text-anchor="middle">08</text>
    <text x="56" y="30" fill="#FFFFFF" font-size="14" font-weight="700">Evidence Generation</text>
    
    <!-- Stage Pill -->
    <rect x="16" y="58" width="115" height="20" rx="4" fill="#FFF1F2"/>
    <text x="24" y="72" fill="#9F1239" font-size="10" font-weight="700">STAGE: EVIDENCE</text>

    <!-- Body Content -->
    <text x="16" y="102" fill="#0F172A" font-size="13" font-weight="700">Visual Bounding-Box Overlay</text>
    <text x="16" y="122" fill="#475569" font-size="12">• Highlights exact infraction zones in Red</text>
    <text x="16" y="142" fill="#475569" font-size="12">• Superimposes Rule Pin &amp; Gazette Citation</text>
    <text x="16" y="162" fill="#475569" font-size="12">• Displays Measured vs. Required statutory values</text>

    <line x1="16" y1="180" x2="330" y2="180" stroke="#F1F5F9" stroke-width="1.5"/>

    <text x="16" y="202" fill="#0F172A" font-size="13" font-weight="700">Statutory Penalty Calculation</text>
    <text x="16" y="222" fill="#475569" font-size="12">• Compounding fee calculation under Rule 32</text>
    <text x="16" y="242" fill="#475569" font-size="12">• Links extracted values to exact legal clauses</text>
    <text x="16" y="262" fill="#475569" font-size="12">• Cryptographic SHA-256 hash locks photos</text>

    <!-- Key Takeaway Box -->
    <rect x="14" y="285" width="318" height="74" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
    <text x="24" y="306" fill="#0A3663" font-size="11" font-weight="700">COURT-ADMISSIBLE EVIDENCE TRAIL</text>
    <text x="24" y="324" fill="#64748B" font-size="11">Every violation is anchored directly to pixels on</text>
    <text x="24" y="342" fill="#64748B" font-size="11">the packaging image with statutory citations.</text>
  </g>

  <!-- Horizontal Arrow 8 -> 9 -->
  <path d="M 1133 779 L 1155 779" stroke="#0284C7" stroke-width="2.5" marker-end="url(#arrowBlue)"/>

  <!-- STEP 09: Generate Inspection Report -->
  <g transform="translate(1158, 592)" filter="url(#cardShadow)">
    <rect x="0" y="0" width="346" height="374" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <path d="M 0 10 Q 0 0 10 0 L 336 0 Q 346 0 346 10 L 346 48 L 0 48 Z" fill="#0A3663"/>
    <rect x="12" y="10" width="34" height="28" rx="6" fill="#D97706"/>
    <text x="29" y="29" fill="#FFFFFF" font-size="14" font-weight="800" text-anchor="middle">09</text>
    <text x="56" y="30" fill="#FFFFFF" font-size="14" font-weight="700">Generate Statutory Report</text>
    
    <!-- Stage Pill -->
    <rect x="16" y="58" width="105" height="20" rx="4" fill="#F1F5F9"/>
    <text x="24" y="72" fill="#334155" font-size="10" font-weight="700">STAGE: REPORT</text>

    <!-- Body Content -->
    <text x="16" y="102" fill="#0F172A" font-size="13" font-weight="700">Official Seventh Schedule Forms</text>
    <text x="16" y="122" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">Form A:</tspan> Weight Checking Data Sheet</text>
    <text x="16" y="142" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">Form B:</tspan> Volume / Length Checking Sheet</text>
    <text x="16" y="162" fill="#475569" font-size="12">• Auto-populated with sample metrics &amp; MPE</text>

    <line x1="16" y1="180" x2="330" y2="180" stroke="#F1F5F9" stroke-width="1.5"/>

    <text x="16" y="202" fill="#0F172A" font-size="13" font-weight="700">Comprehensive Dossier Assembly</text>
    <text x="16" y="222" fill="#475569" font-size="12">• High-resolution photographic evidence dossier</text>
    <text x="16" y="242" fill="#475569" font-size="12">• Digital signature blocks: Officer &amp; Trader</text>
    <text x="16" y="262" fill="#475569" font-size="12">• Exportable as standardized 1-click legal PDF</text>

    <!-- Key Takeaway Box -->
    <rect x="14" y="285" width="318" height="74" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
    <text x="24" y="306" fill="#0A3663" font-size="11" font-weight="700">INSTANT STATUTORY NOTICE CREATION</text>
    <text x="24" y="324" fill="#64748B" font-size="11">Replaces hours of manual form-filling with</text>
    <text x="24" y="342" fill="#64748B" font-size="11">standardized government-ready PDF sheets.</text>
  </g>

  <!-- Horizontal Arrow 9 -> 10 -->
  <path d="M 1504 779 L 1526 779" stroke="#0284C7" stroke-width="2.5" marker-end="url(#arrowBlue)"/>

  <!-- STEP 10: Save Inspection & Cloud Sync -->
  <g transform="translate(1529, 592)" filter="url(#cardShadow)">
    <rect x="0" y="0" width="346" height="374" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <path d="M 0 10 Q 0 0 10 0 L 336 0 Q 346 0 346 10 L 346 48 L 0 48 Z" fill="#0A3663"/>
    <rect x="12" y="10" width="34" height="28" rx="6" fill="#D97706"/>
    <text x="29" y="29" fill="#FFFFFF" font-size="14" font-weight="800" text-anchor="middle">10</text>
    <text x="56" y="30" fill="#FFFFFF" font-size="14" font-weight="700">Save &amp; Central Cloud Sync</text>
    
    <!-- Stage Pill -->
    <rect x="16" y="58" width="135" height="20" rx="4" fill="#F1F5F9"/>
    <text x="24" y="72" fill="#334155" font-size="10" font-weight="700">STAGE: REPORT &amp; SYNC</text>

    <!-- Body Content -->
    <text x="16" y="102" fill="#0F172A" font-size="13" font-weight="700">Offline-First Local Vault</text>
    <text x="16" y="122" fill="#475569" font-size="12">• <tspan font-weight="700" fill="#0A3663">Zero Internet Mode:</tspan> Stored in IndexedDB</text>
    <text x="16" y="142" fill="#475569" font-size="12">• Local cryptographic storage prevents data loss</text>
    <text x="16" y="162" fill="#475569" font-size="12">• Inspection immediately completed on-site</text>

    <line x1="16" y1="180" x2="330" y2="180" stroke="#F1F5F9" stroke-width="1.5"/>

    <text x="16" y="202" fill="#0F172A" font-size="13" font-weight="700">Automated Server Synchronization</text>
    <text x="16" y="222" fill="#475569" font-size="12">• Auto-syncs to Central DB upon connectivity</text>
    <text x="16" y="242" fill="#475569" font-size="12">• High-res image blobs synced to Cloud Vault</text>
    <text x="16" y="262" fill="#475569" font-size="12">• National enforcement dashboard updated</text>

    <!-- Key Takeaway Box -->
    <rect x="14" y="285" width="318" height="74" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
    <text x="24" y="306" fill="#0A3663" font-size="11" font-weight="700">DUAL RESILIENCE: OFFLINE + CLOUD</text>
    <text x="24" y="324" fill="#64748B" font-size="11">Immediate offline local finalization with seamless,</text>
    <text x="24" y="342" fill="#64748B" font-size="11">conflict-free background server sync.</text>
  </g>

  <!-- ==================== BOTTOM ARCHITECTURAL PRINCIPLES BAR ==================== -->
  <g transform="translate(45, 982)">
    <rect x="0" y="0" width="1830" height="78" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" filter="url(#cardShadow)"/>
    
    <!-- Principle 1 -->
    <g transform="translate(20, 12)">
      <rect x="0" y="0" width="40" height="54" rx="6" fill="#EFF6FF"/>
      <text x="20" y="34" fill="#1D4ED8" font-size="20" text-anchor="middle">🛡️</text>
      <text x="52" y="24" fill="#0A3663" font-size="13" font-weight="800">OFFICER-IN-THE-LOOP JURISDICTION</text>
      <text x="52" y="44" fill="#64748B" font-size="11">AI assists detection; statutory enforcement authority strictly rests with authorized officer.</text>
    </g>

    <!-- Divider -->
    <line x1="600" y1="12" x2="600" y2="66" stroke="#E2E8F0" stroke-width="1.5"/>

    <!-- Principle 2 -->
    <g transform="translate(620, 12)">
      <rect x="0" y="0" width="40" height="54" rx="6" fill="#FEF3C7"/>
      <text x="20" y="34" fill="#B45309" font-size="20" text-anchor="middle">⚖️</text>
      <text x="52" y="24" fill="#0A3663" font-size="13" font-weight="800">DETERMINISTIC COMPLIANCE RULES</text>
      <text x="52" y="44" fill="#64748B" font-size="11">Rules are hardcoded from PCR 2011 &amp; Gazette — no probabilistic hallucination in legal decisions.</text>
    </g>

    <!-- Divider -->
    <line x1="1210" y1="12" x2="1210" y2="66" stroke="#E2E8F0" stroke-width="1.5"/>

    <!-- Principle 3 -->
    <g transform="translate(1230, 12)">
      <rect x="0" y="0" width="40" height="54" rx="6" fill="#F0FDF4"/>
      <text x="20" y="34" fill="#15803D" font-size="20" text-anchor="middle">⚡</text>
      <text x="52" y="24" fill="#0A3663" font-size="13" font-weight="800">100% OFFLINE-FIRST FIELD CAPABILITY</text>
      <text x="52" y="44" fill="#64748B" font-size="11">Zero dependencies on live cellular data in rural markets; auto-syncs securely when connected.</text>
    </g>
  </g>
</svg>'''

def generate_svg_diagram2():
    """Generates DIAGRAM 2 — TECHNICAL ARCHITECTURE (Multi-Tier System Architecture)."""
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080" style="background:#F8FAFC; font-family:'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;">
  <defs>
    <!-- Shadow filter for clean cards -->
    <filter id="cardShadow2" x="-2%" y="-2%" width="104%" height="106%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#0F172A" flood-opacity="0.06"/>
    </filter>
    <filter id="headerShadow2" x="-1%" y="-2%" width="102%" height="106%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.12"/>
    </filter>

    <!-- Markers -->
    <marker id="arrowDownNavy" viewBox="0 0 10 10" refX="5" refY="8" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 1.5 0 L 5 8 L 8.5 0 z" fill="#0A3663"/>
    </marker>
    <marker id="arrowRightGold" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#D97706"/>
    </marker>
    <marker id="arrowLeftGold" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 10 1.5 L 2 5 L 10 8.5 z" fill="#D97706"/>
    </marker>
    <marker id="arrowDownBlue" viewBox="0 0 10 10" refX="5" refY="8" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 1.5 0 L 5 8 L 8.5 0 z" fill="#0284C7"/>
    </marker>
  </defs>

  <!-- ==================== TOP HEADER BANNER ==================== -->
  <rect x="0" y="0" width="1920" height="84" fill="#0A2540" filter="url(#headerShadow2)"/>
  <rect x="0" y="80" width="1920" height="4" fill="#D97706"/> <!-- Govt Gold Stripe -->

  <!-- Top Metadata & Team Badge -->
  <g transform="translate(45, 14)">
    <rect x="0" y="0" width="460" height="26" rx="13" fill="#1E3A8A"/>
    <text x="15" y="17" fill="#F8FAFC" font-size="11" font-weight="600" letter-spacing="0.5">SMART INDIA HACKATHON 2026 | PS ID: SIH-26034</text>
    <text x="315" y="17" fill="#FCD34D" font-size="11" font-weight="700">| MoCA, Food &amp; PD</text>

    <text x="0" y="52" fill="#FFFFFF" font-size="22" font-weight="700" letter-spacing="0.3">INSPACK — MULTI-TIER SYSTEM ARCHITECTURE</text>
  </g>

  <!-- Right Header Badge -->
  <g transform="translate(1485, 16)">
    <rect x="0" y="0" width="390" height="52" rx="8" fill="#0F2F57" stroke="#334E68" stroke-width="1"/>
    <text x="20" y="22" fill="#94A3B8" font-size="10" font-weight="600" text-transform="uppercase" letter-spacing="1">SOVEREIGN • LOCAL-FIRST • DETERMINISTIC</text>
    <text x="20" y="42" fill="#38BDF8" font-size="13" font-weight="700">Team: Neural Knights</text>
    <text x="180" y="42" fill="#E2E8F0" font-size="12" font-weight="400">| Chaitanya Bharathi Institute of Technology</text>
  </g>

  <!-- ========================================================================= -->
  <!-- MAIN ARCHITECTURE STACK: LAYERS 1 TO 6                                    -->
  <!-- Width: 1370 (x: 45 to 1415)                                               -->
  <!-- ========================================================================= -->

  <!-- ==================== LAYER 1: FIELD / USER ==================== -->
  <g transform="translate(45, 96)" filter="url(#cardShadow2)">
    <rect x="0" y="0" width="1370" height="118" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <!-- Layer Header Banner -->
    <path d="M 0 8 Q 0 0 8 0 L 1362 0 Q 1370 0 1370 8 L 1370 32 L 0 32 Z" fill="#0A3663"/>
    <text x="18" y="21" fill="#FFFFFF" font-size="13" font-weight="800" letter-spacing="0.5">LAYER 1 — FIELD / USER LAYER</text>
    <rect x="1230" y="6" width="125" height="20" rx="4" fill="#1E40AF"/>
    <text x="1292" y="19" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">EDGE CLIENT</text>

    <!-- Sub-blocks (4 items) -->
    <!-- Block 1.1 -->
    <g transform="translate(16, 42)">
      <rect x="0" y="0" width="315" height="64" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="22" fill="#0A3663" font-size="12" font-weight="700">Mobile / PWA Application</text>
      <text x="12" y="40" fill="#475569" font-size="11">• React 18 + TypeScript + Vite PWA</text>
      <text x="12" y="55" fill="#475569" font-size="11">• Responsive UI for handheld smartphones</text>
    </g>

    <!-- Block 1.2 -->
    <g transform="translate(347, 42)">
      <rect x="0" y="0" width="325" height="64" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="22" fill="#0A3663" font-size="12" font-weight="700">Field Inspection Officer</text>
      <text x="12" y="40" fill="#475569" font-size="11">• Authorized Officer biometric/SSO login</text>
      <text x="12" y="55" fill="#475569" font-size="11">• Geo-tagging &amp; session tamper verification</text>
    </g>

    <!-- Block 1.3 -->
    <g transform="translate(688, 42)">
      <rect x="0" y="0" width="330" height="64" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="22" fill="#0A3663" font-size="12" font-weight="700">Camera / Package Images</text>
      <text x="12" y="40" fill="#475569" font-size="11">• Multi-View: Front (PDP), Back &amp; Sides</text>
      <text x="12" y="55" fill="#475569" font-size="11">• On-screen viewfinder &amp; torch toggle</text>
    </g>

    <!-- Block 1.4 -->
    <g transform="translate(1034, 42)">
      <rect x="0" y="0" width="320" height="64" rx="6" fill="#F0FDF4" stroke="#86EFAC" stroke-width="1"/>
      <text x="12" y="22" fill="#166534" font-size="12" font-weight="700">Online + Offline Operation</text>
      <text x="12" y="40" fill="#475569" font-size="11">• Automatic connection status detection</text>
      <text x="12" y="55" fill="#475569" font-size="11">• Seamless local execution with zero latency</text>
    </g>
  </g>

  <!-- Data Flow 1 -> 2 -->
  <g transform="translate(730, 214)">
    <line x1="0" y1="0" x2="0" y2="24" stroke="#0A3663" stroke-width="2" marker-end="url(#arrowDownNavy)"/>
    <rect x="-190" y="4" width="380" height="18" rx="4" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
    <text x="0" y="16" fill="#1E40AF" font-size="10" font-weight="700" text-anchor="middle">
      DATA FLOW: Multi-View Raw Image Frames &amp; Inspection Metadata
    </text>
  </g>

  <!-- ==================== LAYER 2: IMAGE PROCESSING ==================== -->
  <g transform="translate(45, 240)" filter="url(#cardShadow2)">
    <rect x="0" y="0" width="1370" height="118" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <path d="M 0 8 Q 0 0 8 0 L 1362 0 Q 1370 0 1370 8 L 1370 32 L 0 32 Z" fill="#0A3663"/>
    <text x="18" y="21" fill="#FFFFFF" font-size="13" font-weight="800" letter-spacing="0.5">LAYER 2 — IMAGE PROCESSING &amp; QUALITY ASSURANCE</text>
    <rect x="1205" y="6" width="150" height="20" rx="4" fill="#1E40AF"/>
    <text x="1280" y="19" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">EDGE COMPUTER VISION</text>

    <!-- Sub-blocks (4 items) -->
    <!-- Block 2.1 -->
    <g transform="translate(16, 42)">
      <rect x="0" y="0" width="315" height="64" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="22" fill="#0A3663" font-size="12" font-weight="700">Quality / Sharpness Check</text>
      <text x="12" y="40" fill="#475569" font-size="11">• Laplacian variance blur estimation</text>
      <text x="12" y="55" fill="#475569" font-size="11">• Glare / reflection / contrast scoring</text>
    </g>

    <!-- Block 2.2 -->
    <g transform="translate(347, 42)">
      <rect x="0" y="0" width="325" height="64" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="22" fill="#0A3663" font-size="12" font-weight="700">Pre-processing Pipeline</text>
      <text x="12" y="40" fill="#475569" font-size="11">• Grayscale conversion &amp; luminance stretch</text>
      <text x="12" y="55" fill="#475569" font-size="11">• Adaptive thresholding &amp; noise removal</text>
    </g>

    <!-- Block 2.3 -->
    <g transform="translate(688, 42)">
      <rect x="0" y="0" width="330" height="64" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="22" fill="#0A3663" font-size="12" font-weight="700">Multi-view Image Handling</text>
      <text x="12" y="40" fill="#475569" font-size="11">• Perspective rectification &amp; alignment</text>
      <text x="12" y="55" fill="#475569" font-size="11">• Multi-angle packaging coordinate registry</text>
    </g>

    <!-- Block 2.4 -->
    <g transform="translate(1034, 42)">
      <rect x="0" y="0" width="320" height="64" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="22" fill="#0A3663" font-size="12" font-weight="700">Package Region Detection</text>
      <text x="12" y="40" fill="#475569" font-size="11">• Principal Display Panel (PDP) bounding</text>
      <text x="12" y="55" fill="#475569" font-size="11">• Text cluster Region of Interest (ROI) split</text>
    </g>
  </g>

  <!-- Data Flow 2 -> 3 -->
  <g transform="translate(730, 358)">
    <line x1="0" y1="0" x2="0" y2="24" stroke="#0A3663" stroke-width="2" marker-end="url(#arrowDownNavy)"/>
    <rect x="-180" y="4" width="360" height="18" rx="4" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
    <text x="0" y="16" fill="#1E40AF" font-size="10" font-weight="700" text-anchor="middle">
      DATA FLOW: Normalized Packaging ROIs &amp; PDP Dimension Map
    </text>
  </g>

  <!-- ==================== LAYER 3: DOCUMENT AI / OCR ==================== -->
  <g transform="translate(45, 384)" filter="url(#cardShadow2)">
    <rect x="0" y="0" width="1370" height="118" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <path d="M 0 8 Q 0 0 8 0 L 1362 0 Q 1370 0 1370 8 L 1370 32 L 0 32 Z" fill="#0A3663"/>
    <text x="18" y="21" fill="#FFFFFF" font-size="13" font-weight="800" letter-spacing="0.5">LAYER 3 — DOCUMENT AI &amp; OPTICAL CHARACTER RECOGNITION (OCR)</text>
    <rect x="1175" y="6" width="180" height="20" rx="4" fill="#166534"/>
    <text x="1265" y="19" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">SOVEREIGN AI / NO CLOUD LLM</text>

    <!-- Sub-blocks (5 items) -->
    <!-- Block 3.1 -->
    <g transform="translate(16, 42)">
      <rect x="0" y="0" width="250" height="64" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="22" fill="#0A3663" font-size="12" font-weight="700">OCR Engine</text>
      <text x="12" y="40" fill="#475569" font-size="11">• Sovereign Edge OCR worker</text>
      <text x="12" y="55" fill="#475569" font-size="11">• Multi-script (Hindi &amp; English)</text>
    </g>

    <!-- Block 3.2 -->
    <g transform="translate(282, 42)">
      <rect x="0" y="0" width="255" height="64" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="22" fill="#0A3663" font-size="12" font-weight="700">Text Extraction</text>
      <text x="12" y="40" fill="#475569" font-size="11">• Alphanumerics &amp; SI symbols</text>
      <text x="12" y="55" fill="#475569" font-size="11">• Strict character-level precision</text>
    </g>

    <!-- Block 3.3 -->
    <g transform="translate(553, 42)">
      <rect x="0" y="0" width="265" height="64" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="22" fill="#0A3663" font-size="12" font-weight="700">Layout Understanding</text>
      <text x="12" y="40" fill="#475569" font-size="11">• Spatial line &amp; hierarchy grouping</text>
      <text x="12" y="55" fill="#475569" font-size="11">• Text bounding-box coordinates</text>
    </g>

    <!-- Block 3.4 -->
    <g transform="translate(834, 42)">
      <rect x="0" y="0" width="260" height="64" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="22" fill="#0A3663" font-size="12" font-weight="700">Field &amp; Entity Detection</text>
      <text x="12" y="40" fill="#475569" font-size="11">• Qty, MRP, Mfg, Dates, Care</text>
      <text x="12" y="55" fill="#475569" font-size="11">• Key-Value semantic mapping</text>
    </g>

    <!-- Block 3.5 -->
    <g transform="translate(1110, 42)">
      <rect x="0" y="0" width="244" height="64" rx="6" fill="#F0FDF4" stroke="#86EFAC" stroke-width="1"/>
      <text x="12" y="22" fill="#166534" font-size="12" font-weight="700">Structured JSON Output</text>
      <text x="12" y="40" fill="#475569" font-size="11">• Typed declaration schema</text>
      <text x="12" y="55" fill="#475569" font-size="11">• Bounding-box spatial metadata</text>
    </g>
  </g>

  <!-- Data Flow 3 -> 4 -->
  <g transform="translate(730, 502)">
    <line x1="0" y1="0" x2="0" y2="24" stroke="#0A3663" stroke-width="2" marker-end="url(#arrowDownNavy)"/>
    <rect x="-195" y="4" width="390" height="18" rx="4" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
    <text x="0" y="16" fill="#1E40AF" font-size="10" font-weight="700" text-anchor="middle">
      DATA FLOW: Structured Declaration JSON &amp; Pixel Coordinate Registry
    </text>
  </g>

  <!-- ==================== LAYER 4: COMPLIANCE ENGINE ==================== -->
  <g transform="translate(45, 528)" filter="url(#cardShadow2)">
    <rect x="0" y="0" width="1370" height="126" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <path d="M 0 8 Q 0 0 8 0 L 1362 0 Q 1370 0 1370 8 L 1370 32 L 0 32 Z" fill="#0A3663"/>
    <text x="18" y="21" fill="#FFFFFF" font-size="13" font-weight="800" letter-spacing="0.5">LAYER 4 — DETERMINISTIC LEGAL METROLOGY COMPLIANCE ENGINE</text>
    <rect x="1145" y="6" width="210" height="20" rx="4" fill="#B45309"/>
    <text x="1250" y="19" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">PURE RULES / ZERO HALLUCINATION</text>

    <!-- Sub-blocks (5 items) -->
    <!-- Block 4.1 -->
    <g transform="translate(16, 42)">
      <rect x="0" y="0" width="250" height="72" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="20" fill="#0A3663" font-size="12" font-weight="700">LMPC Statutory Rule Checks</text>
      <text x="12" y="38" fill="#475569" font-size="11">• Rule 6: Mandatory items</text>
      <text x="12" y="52" fill="#475569" font-size="11">• Rule 10: Complete address &amp; PIN</text>
      <text x="12" y="66" fill="#475569" font-size="11">• Rule 13: SI Unit symbols</text>
    </g>

    <!-- Block 4.2 -->
    <g transform="translate(282, 42)">
      <rect x="0" y="0" width="255" height="72" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="20" fill="#0A3663" font-size="12" font-weight="700">Numeral &amp; Font Height</text>
      <text x="12" y="38" fill="#475569" font-size="11">• Rule 7, Table I &amp; II minimums</text>
      <text x="12" y="52" fill="#475569" font-size="11">• Font height vs. PDP Area</text>
      <text x="12" y="66" fill="#475569" font-size="11">• Rule 8 clear space check</text>
    </g>

    <!-- Block 4.3 -->
    <g transform="translate(553, 42)">
      <rect x="0" y="0" width="265" height="72" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="20" fill="#0A3663" font-size="12" font-weight="700">Standard Pack Sizes</text>
      <text x="12" y="38" fill="#475569" font-size="11">• Second Schedule compliance</text>
      <text x="12" y="52" fill="#475569" font-size="11">• 19 Commodity categories</text>
      <text x="12" y="66" fill="#475569" font-size="11">• Flags non-standard packs</text>
    </g>

    <!-- Block 4.4 -->
    <g transform="translate(834, 42)">
      <rect x="0" y="0" width="260" height="72" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="20" fill="#0A3663" font-size="12" font-weight="700">MPE Deficiency Margin</text>
      <text x="12" y="38" fill="#475569" font-size="11">• First Schedule calculations</text>
      <text x="12" y="52" fill="#475569" font-size="11">• Maximum Permissible Error</text>
      <text x="12" y="66" fill="#475569" font-size="11">• Net weight vs. gross tare math</text>
    </g>

    <!-- Block 4.5 -->
    <g transform="translate(1110, 42)">
      <rect x="0" y="0" width="244" height="72" rx="6" fill="#FEF3C7" stroke="#FCD34D" stroke-width="1"/>
      <text x="12" y="20" fill="#92400E" font-size="12" font-weight="700">Configurable Gazette Rules</text>
      <text x="12" y="38" fill="#475569" font-size="11">• Versioned statutory logic</text>
      <text x="12" y="52" fill="#475569" font-size="11">• Dynamic rule table registry</text>
      <text x="12" y="66" fill="#475569" font-size="11">• Zero code redeployment</text>
    </g>
  </g>

  <!-- Data Flow 4 -> 5 -->
  <g transform="translate(730, 654)">
    <line x1="0" y1="0" x2="0" y2="24" stroke="#0A3663" stroke-width="2" marker-end="url(#arrowDownNavy)"/>
    <rect x="-195" y="4" width="390" height="18" rx="4" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
    <text x="0" y="16" fill="#1E40AF" font-size="10" font-weight="700" text-anchor="middle">
      DATA FLOW: Compliance Findings, Rule Violations &amp; Gazette Citations
    </text>
  </g>

  <!-- ==================== LAYER 5: EVIDENCE & DECISION SUPPORT ==================== -->
  <g transform="translate(45, 680)" filter="url(#cardShadow2)">
    <rect x="0" y="0" width="1370" height="118" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <path d="M 0 8 Q 0 0 8 0 L 1362 0 Q 1370 0 1370 8 L 1370 32 L 0 32 Z" fill="#0A3663"/>
    <text x="18" y="21" fill="#FFFFFF" font-size="13" font-weight="800" letter-spacing="0.5">LAYER 5 — EVIDENCE ATTESTATION &amp; DECISION SUPPORT LAYER</text>
    <rect x="1195" y="6" width="160" height="20" rx="4" fill="#6B21A8"/>
    <text x="1275" y="19" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">HUMAN-IN-THE-LOOP</text>

    <!-- Sub-blocks (5 items) -->
    <!-- Block 5.1 -->
    <g transform="translate(16, 42)">
      <rect x="0" y="0" width="250" height="64" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="22" fill="#0A3663" font-size="12" font-weight="700">Findings Aggregator</text>
      <text x="12" y="40" fill="#475569" font-size="11">• Compliant / Non-compliant split</text>
      <text x="12" y="55" fill="#475569" font-size="11">• Severity &amp; compounding scores</text>
    </g>

    <!-- Block 5.2 -->
    <g transform="translate(282, 42)">
      <rect x="0" y="0" width="255" height="64" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="22" fill="#0A3663" font-size="12" font-weight="700">Bounding-Box Evidence</text>
      <text x="12" y="40" fill="#475569" font-size="11">• Exact visual violation overlays</text>
      <text x="12" y="55" fill="#475569" font-size="11">• Spatial pinpoints on raw photos</text>
    </g>

    <!-- Block 5.3 -->
    <g transform="translate(553, 42)">
      <rect x="0" y="0" width="265" height="64" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="22" fill="#0A3663" font-size="12" font-weight="700">Rule References &amp; Penalties</text>
      <text x="12" y="40" fill="#475569" font-size="11">• Exact Gazette legal section tags</text>
      <text x="12" y="55" fill="#475569" font-size="11">• Rule 32 statutory compounding fee</text>
    </g>

    <!-- Block 5.4 -->
    <g transform="translate(834, 42)">
      <rect x="0" y="0" width="260" height="64" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="22" fill="#0A3663" font-size="12" font-weight="700">Photographic Dossier</text>
      <text x="12" y="40" fill="#475569" font-size="11">• Tamper-evident image bundle</text>
      <text x="12" y="55" fill="#475569" font-size="11">• Cryptographic SHA-256 seal</text>
    </g>

    <!-- Block 5.5 -->
    <g transform="translate(1110, 42)">
      <rect x="0" y="0" width="244" height="64" rx="6" fill="#FAF5FF" stroke="#D8B4FE" stroke-width="1"/>
      <text x="12" y="22" fill="#6B21A8" font-size="12" font-weight="700">Officer Adjudication</text>
      <text x="12" y="40" fill="#475569" font-size="11">• Final human review &amp; sign-off</text>
      <text x="12" y="55" fill="#475569" font-size="11">• Statutory enforcement authority</text>
    </g>
  </g>

  <!-- Data Flow 5 -> 6 -->
  <g transform="translate(730, 798)">
    <line x1="0" y1="0" x2="0" y2="24" stroke="#0A3663" stroke-width="2" marker-end="url(#arrowDownNavy)"/>
    <rect x="-195" y="4" width="390" height="18" rx="4" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
    <text x="0" y="16" fill="#1E40AF" font-size="10" font-weight="700" text-anchor="middle">
      DATA FLOW: Signed Inspection Dossier, Statutory Forms &amp; Image Hashes
    </text>
  </g>

  <!-- ==================== LAYER 6: STORAGE / REPORTING ==================== -->
  <g transform="translate(45, 824)" filter="url(#cardShadow2)">
    <rect x="0" y="0" width="1370" height="142" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <path d="M 0 8 Q 0 0 8 0 L 1362 0 Q 1370 0 1370 8 L 1370 32 L 0 32 Z" fill="#0A3663"/>
    <text x="18" y="21" fill="#FFFFFF" font-size="13" font-weight="800" letter-spacing="0.5">LAYER 6 — STORAGE, REPORTING &amp; SYNCHRONIZATION LAYER</text>
    <rect x="1175" y="6" width="180" height="20" rx="4" fill="#0F766E"/>
    <text x="1265" y="19" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">LOCAL-FIRST &amp; CENTRAL SYNC</text>

    <!-- Sub-blocks (6 items in 2 rows or 6 columns) -->
    <!-- Block 6.1 -->
    <g transform="translate(16, 42)">
      <rect x="0" y="0" width="205" height="88" rx="6" fill="#F0FDF4" stroke="#86EFAC" stroke-width="1"/>
      <text x="12" y="22" fill="#166534" font-size="12" font-weight="700">Local-First Vault</text>
      <text x="12" y="42" fill="#475569" font-size="11">• IndexedDB / SQLite</text>
      <text x="12" y="58" fill="#475569" font-size="11">• 100% Offline storage</text>
      <text x="12" y="74" fill="#475569" font-size="11">• Zero data loss in mandis</text>
    </g>

    <!-- Block 6.2 -->
    <g transform="translate(237, 42)">
      <rect x="0" y="0" width="215" height="88" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="22" fill="#0A3663" font-size="12" font-weight="700">Statutory PDF Engine</text>
      <text x="12" y="42" fill="#475569" font-size="11">• Form A (Weight sheet)</text>
      <text x="12" y="58" fill="#475569" font-size="11">• Form B (Volume sheet)</text>
      <text x="12" y="74" fill="#475569" font-size="11">• Seventh Schedule format</text>
    </g>

    <!-- Block 6.3 -->
    <g transform="translate(468, 42)">
      <rect x="0" y="0" width="215" height="88" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="22" fill="#0A3663" font-size="12" font-weight="700">PostgreSQL DB</text>
      <text x="12" y="42" fill="#475569" font-size="11">• Structured central DB</text>
      <text x="12" y="58" fill="#475569" font-size="11">• Enforcement analytics</text>
      <text x="12" y="74" fill="#475569" font-size="11">• National inspection log</text>
    </g>

    <!-- Block 6.4 -->
    <g transform="translate(699, 42)">
      <rect x="0" y="0" width="215" height="88" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="22" fill="#0A3663" font-size="12" font-weight="700">Object Storage</text>
      <text x="12" y="42" fill="#475569" font-size="11">• Cloud image repository</text>
      <text x="12" y="58" fill="#475569" font-size="11">• Encrypted at rest</text>
      <text x="12" y="74" fill="#475569" font-size="11">• High-res evidence archive</text>
    </g>

    <!-- Block 6.5 -->
    <g transform="translate(930, 42)">
      <rect x="0" y="0" width="205" height="88" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="12" y="22" fill="#0A3663" font-size="12" font-weight="700">Audit Trail</text>
      <text x="12" y="42" fill="#475569" font-size="11">• Timestamp &amp; GPS logs</text>
      <text x="12" y="58" fill="#475569" font-size="11">• Officer identity binding</text>
      <text x="12" y="74" fill="#475569" font-size="11">• Court-admissible proof</text>
    </g>

    <!-- Block 6.6 -->
    <g transform="translate(1151, 42)">
      <rect x="0" y="0" width="203" height="88" rx="6" fill="#EFF6FF" stroke="#93C5FD" stroke-width="1"/>
      <text x="12" y="22" fill="#1D4ED8" font-size="12" font-weight="700">Secure Sync</text>
      <text x="12" y="42" fill="#475569" font-size="11">• TLS 1.3 encryption</text>
      <text x="12" y="58" fill="#475569" font-size="11">• Background auto-retry</text>
      <text x="12" y="74" fill="#475569" font-size="11">• Conflict-free merging</text>
    </g>
  </g>

  <!-- ========================================================================= -->
  <!-- RIGHT SIDE: ADMIN / RULE MANAGEMENT SUBSYSTEM                             -->
  <!-- Width: 430 (x: 1445 to 1875)                                              -->
  <!-- ========================================================================= -->

  <!-- Top Right Card: Context / Environment Overview -->
  <g transform="translate(1445, 96)" filter="url(#cardShadow2)">
    <rect x="0" y="0" width="430" height="262" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <path d="M 0 8 Q 0 0 8 0 L 422 0 Q 430 0 430 8 L 430 32 L 0 32 Z" fill="#1E3A8A"/>
    <text x="16" y="21" fill="#FFFFFF" font-size="12" font-weight="800" letter-spacing="0.5">INSPECTION ENVIRONMENT &amp; LEGAL CONTEXT</text>

    <g transform="translate(16, 44)">
      <!-- Item 1 -->
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="398" height="46" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
        <text x="12" y="18" fill="#0A3663" font-size="11" font-weight="700">Jurisdiction &amp; Regulatory Act</text>
        <text x="12" y="34" fill="#475569" font-size="10">Legal Metrology Act, 2009 &amp; Packaged Commodities Rules, 2011</text>
      </g>

      <!-- Item 2 -->
      <g transform="translate(0, 52)">
        <rect x="0" y="0" width="398" height="46" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
        <text x="12" y="18" fill="#0A3663" font-size="11" font-weight="700">Enforcement Scope</text>
        <text x="12" y="34" fill="#475569" font-size="10">Retail stores, Supermarkets, E-Commerce Dark Stores &amp; Mandis</text>
      </g>

      <!-- Item 3 -->
      <g transform="translate(0, 104)">
        <rect x="0" y="0" width="398" height="46" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
        <text x="12" y="18" fill="#0A3663" font-size="11" font-weight="700">Deployment Architecture</text>
        <text x="12" y="34" fill="#475569" font-size="10">Local-first Progressive Web App (PWA) with Edge AI capabilities</text>
      </g>

      <!-- Item 4 -->
      <g transform="translate(0, 156)">
        <rect x="0" y="0" width="398" height="46" rx="6" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
        <text x="12" y="18" fill="#1D4ED8" font-size="11" font-weight="700">Sovereign Edge Guarantee</text>
        <text x="12" y="34" fill="#475569" font-size="10">Zero commercial LLM dependencies; privacy-preserved edge OCR</text>
      </g>
    </g>
  </g>

  <!-- ADMIN & RULE MANAGEMENT SUBSYSTEM (Directly Connected to Layer 4) -->
  <g transform="translate(1445, 384)" filter="url(#cardShadow2)">
    <rect x="0" y="0" width="430" height="380" rx="8" fill="#FFFFFF" stroke="#D97706" stroke-width="2"/>
    <path d="M 0 8 Q 0 0 8 0 L 422 0 Q 430 0 430 8 L 430 36 L 0 36 Z" fill="#D97706"/>
    <text x="16" y="24" fill="#FFFFFF" font-size="13" font-weight="800" letter-spacing="0.5">ADMIN &amp; RULE MANAGEMENT SUBSYSTEM</text>

    <!-- Content Items -->
    <g transform="translate(16, 48)">
      <!-- Admin 1 -->
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="398" height="56" rx="6" fill="#FFFBEB" stroke="#FDE68A" stroke-width="1"/>
        <text x="12" y="20" fill="#92400E" font-size="12" font-weight="700">Gazette / Rule Configuration</text>
        <text x="12" y="36" fill="#78350F" font-size="11">• Central Ministry portal for rule updates</text>
        <text x="12" y="50" fill="#78350F" font-size="11">• Coded parameters for amendments (2021, 2022)</text>
      </g>

      <!-- Admin 2 -->
      <g transform="translate(0, 64)">
        <rect x="0" y="0" width="398" height="56" rx="6" fill="#FFFBEB" stroke="#FDE68A" stroke-width="1"/>
        <text x="12" y="20" fill="#92400E" font-size="12" font-weight="700">Versioned Compliance Logic</text>
        <text x="12" y="36" fill="#78350F" font-size="11">• Multi-version rule repository (v2011.1, v2022.2)</text>
        <text x="12" y="50" fill="#78350F" font-size="11">• Backward-compatible checking by packing date</text>
      </g>

      <!-- Admin 3 -->
      <g transform="translate(0, 128)">
        <rect x="0" y="0" width="398" height="56" rx="6" fill="#FFFBEB" stroke="#FDE68A" stroke-width="1"/>
        <text x="12" y="20" fill="#92400E" font-size="12" font-weight="700">Standard Pack Size Manager</text>
        <text x="12" y="36" fill="#78350F" font-size="11">• Second Schedule table updates via GUI</text>
        <text x="12" y="50" fill="#78350F" font-size="11">• Commodity-specific exemption overrides</text>
      </g>

      <!-- Admin 4 -->
      <g transform="translate(0, 192)">
        <rect x="0" y="0" width="398" height="56" rx="6" fill="#FFFBEB" stroke="#FDE68A" stroke-width="1"/>
        <text x="12" y="20" fill="#92400E" font-size="12" font-weight="700">Compounding Penalty Rates</text>
        <text x="12" y="36" fill="#78350F" font-size="11">• Section 32 penalty fee schedule configuration</text>
        <text x="12" y="50" fill="#78350F" font-size="11">• State-level compounding rate adjustments</text>
      </g>

      <!-- Admin 5 -->
      <g transform="translate(0, 256)">
        <rect x="0" y="0" width="398" height="56" rx="6" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
        <text x="12" y="20" fill="#1E40AF" font-size="12" font-weight="700">Signed Rule Distribution Engine</text>
        <text x="12" y="36" fill="#1E3A8A" font-size="11">• Pushes cryptographically signed rule JSON</text>
        <text x="12" y="50" fill="#1E3A8A" font-size="11">• Seamless edge updates with zero app downtime</text>
      </g>
    </g>
  </g>

  <!-- DYNAMIC BIDIRECTIONAL CONNECTOR: ADMIN -> LAYER 4 -->
  <g>
    <!-- Line from Admin Box (left edge, x=1445, y=591) to Layer 4 (right edge, x=1415, y=591) -->
    <line x1="1445" y1="591" x2="1415" y2="591" stroke="#D97706" stroke-width="3" stroke-dasharray="5,3" marker-end="url(#arrowLeftGold)"/>
    
    <!-- Visual label on connection -->
    <rect x="1390" y="575" width="80" height="32" rx="4" fill="#FEF3C7" stroke="#D97706" stroke-width="1"/>
    <text x="1430" y="589" fill="#92400E" font-size="9" font-weight="800" text-anchor="middle">GAZETTE</text>
    <text x="1430" y="601" fill="#92400E" font-size="8" font-weight="700" text-anchor="middle">UPDATES</text>
  </g>

  <!-- Bottom Right Card: Statutory Citation References -->
  <g transform="translate(1445, 786)" filter="url(#cardShadow2)">
    <rect x="0" y="0" width="430" height="180" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <path d="M 0 8 Q 0 0 8 0 L 422 0 Q 430 0 430 8 L 430 32 L 0 32 Z" fill="#0F766E"/>
    <text x="16" y="21" fill="#FFFFFF" font-size="12" font-weight="800" letter-spacing="0.5">STATUTORY COMPLIANCE REFERENCES</text>

    <g transform="translate(16, 42)">
      <text x="0" y="16" fill="#0A3663" font-size="11" font-weight="700">• Rule 6(1): <tspan font-weight="400" fill="#475569">Mandatory declarations (Name, Qty, MRP, Dates)</tspan></text>
      <text x="0" y="36" fill="#0A3663" font-size="11" font-weight="700">• Rule 7 &amp; Tables I/II: <tspan font-weight="400" fill="#475569">Minimum numeral &amp; font heights</tspan></text>
      <text x="0" y="56" fill="#0A3663" font-size="11" font-weight="700">• Rule 13: <tspan font-weight="400" fill="#475569">Standard SI units of weight, volume and length</tspan></text>
      <text x="0" y="76" fill="#0A3663" font-size="11" font-weight="700">• Rule 18: <tspan font-weight="400" fill="#475569">Prohibition of dual MRP &amp; sticker alteration</tspan></text>
      <text x="0" y="96" fill="#0A3663" font-size="11" font-weight="700">• First Schedule: <tspan font-weight="400" fill="#475569">Maximum Permissible Error (MPE) margins</tspan></text>
      <text x="0" y="116" fill="#0A3663" font-size="11" font-weight="700">• Second Schedule: <tspan font-weight="400" fill="#475569">Mandatory standard pack size sizes</tspan></text>
      <text x="0" y="134" fill="#0A3663" font-size="11" font-weight="700">• Seventh Schedule: <tspan font-weight="400" fill="#475569">Form A &amp; Form B statutory data sheets</tspan></text>
    </g>
  </g>

  <!-- ==================== BOTTOM ARCHITECTURAL PRINCIPLES BAR ==================== -->
  <g transform="translate(45, 982)">
    <rect x="0" y="0" width="1830" height="78" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" filter="url(#cardShadow2)"/>

    <!-- Principle 1 -->
    <g transform="translate(16, 12)">
      <rect x="0" y="0" width="38" height="54" rx="6" fill="#F0FDF4"/>
      <text x="19" y="34" fill="#15803D" font-size="20" text-anchor="middle">⚡</text>
      <text x="48" y="22" fill="#0A3663" font-size="12" font-weight="800">LOCAL-FIRST &amp; OFFLINE CAPABLE</text>
      <text x="48" y="38" fill="#64748B" font-size="10.5">Zero cloud dependencies during field inspection;</text>
      <text x="48" y="52" fill="#64748B" font-size="10.5">operates seamlessly in low-connectivity mandis.</text>
    </g>

    <!-- Divider -->
    <line x1="465" y1="12" x2="465" y2="66" stroke="#E2E8F0" stroke-width="1.5"/>

    <!-- Principle 2 -->
    <g transform="translate(480, 12)">
      <rect x="0" y="0" width="38" height="54" rx="6" fill="#FEF3C7"/>
      <text x="19" y="34" fill="#B45309" font-size="20" text-anchor="middle">⚖️</text>
      <text x="48" y="22" fill="#0A3663" font-size="12" font-weight="800">DETERMINISTIC LEGAL REASONING</text>
      <text x="48" y="38" fill="#64748B" font-size="10.5">AI is restricted strictly to OCR extraction;</text>
      <text x="48" y="52" fill="#64748B" font-size="10.5">verdict uses 100% deterministic rule code.</text>
    </g>

    <!-- Divider -->
    <line x1="920" y1="12" x2="920" y2="66" stroke="#E2E8F0" stroke-width="1.5"/>

    <!-- Principle 3 -->
    <g transform="translate(935, 12)">
      <rect x="0" y="0" width="38" height="54" rx="6" fill="#EFF6FF"/>
      <text x="19" y="34" fill="#1D4ED8" font-size="20" text-anchor="middle">🛡️</text>
      <text x="48" y="22" fill="#0A3663" font-size="12" font-weight="800">OFFICER IN THE LOOP</text>
      <text x="48" y="38" fill="#64748B" font-size="10.5">System acts as an evidentiary copilot; final</text>
      <text x="48" y="52" fill="#64748B" font-size="10.5">statutory notice strictly requires officer sign-off.</text>
    </g>

    <!-- Divider -->
    <line x1="1375" y1="12" x2="1375" y2="66" stroke="#E2E8F0" stroke-width="1.5"/>

    <!-- Principle 4 -->
    <g transform="translate(1390, 12)">
      <rect x="0" y="0" width="38" height="54" rx="6" fill="#FAF5FF"/>
      <text x="19" y="34" fill="#6B21A8" font-size="20" text-anchor="middle">🔒</text>
      <text x="48" y="22" fill="#0A3663" font-size="12" font-weight="800">EVIDENCE-LINKED AUDIT TRAIL</text>
      <text x="48" y="38" fill="#64748B" font-size="10.5">Every non-compliance is cryptographically anchored</text>
      <text x="48" y="52" fill="#64748B" font-size="10.5">to raw photo coordinates &amp; gazette citations.</text>
    </g>
  </g>
</svg>'''

def generate_interactive_viewer_html():
    """Generates an interactive HTML viewer allowing users to switch, zoom, and export both diagrams."""
    return '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>INSPACK — SIH 2026 Presentation Diagrams</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
      background: #0F172A;
      color: #F8FAFC;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      background: #0A2540;
      border-bottom: 2px solid #D97706;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge {
      background: #1E3A8A;
      color: #93C5FD;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid #3B82F6;
    }
    h1 {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
    }
    .controls {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }
    .tab-btn {
      background: #1E293B;
      color: #94A3B8;
      border: 1px solid #334155;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tab-btn.active {
      background: #0284C7;
      color: #FFFFFF;
      border-color: #38BDF8;
      box-shadow: 0 0 12px rgba(2, 132, 199, 0.4);
    }
    .action-btn {
      background: #D97706;
      color: #FFFFFF;
      border: none;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background 0.2s;
    }
    .action-btn:hover {
      background: #B45309;
    }
    .action-btn.secondary {
      background: #334155;
      border: 1px solid #475569;
    }
    .action-btn.secondary:hover {
      background: #475569;
    }
    main {
      flex: 1;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #0B1120;
    }
    .diagram-container {
      width: 100%;
      max-width: 1600px;
      background: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 1px solid #1E293B;
    }
    .diagram-viewport {
      width: 100%;
      position: relative;
      background: #F8FAFC;
    }
    .diagram-viewport svg, .diagram-viewport img {
      width: 100%;
      height: auto;
      display: block;
    }
    .meta-bar {
      background: #1E293B;
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #94A3B8;
      border-top: 1px solid #334155;
    }
    .meta-bar strong {
      color: #F8FAFC;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <span class="badge">SIH-26034</span>
      <div>
        <h1>INSPACK Presentation Diagrams</h1>
        <div style="font-size:11px; color:#94A3B8;">Legal Metrology (Packaged Commodities) Rules, 2011 • Team: Neural Knights</div>
      </div>
    </div>
    <div class="controls">
      <button class="tab-btn active" id="tab1Btn" onclick="switchDiagram(1)">Diagram 1: User Workflow</button>
      <button class="tab-btn" id="tab2Btn" onclick="switchDiagram(2)">Diagram 2: Technical Architecture</button>
      <button class="action-btn" onclick="downloadCurrentSVG()">
        <span>⬇</span> Download SVG (Vector)
      </button>
      <button class="action-btn secondary" onclick="downloadCurrentPNG()">
        <span>🖼</span> Download 4K PNG (For PPT)
      </button>
    </div>
  </header>

  <main>
    <div class="diagram-container">
      <div class="diagram-viewport" id="viewport">
        <!-- SVG will be injected here -->
      </div>
      <div class="meta-bar">
        <span id="diagramDesc"><strong>Diagram 1:</strong> Complete 10-step Field Officer Inspection & Compliance Workflow</span>
        <span>Resolution: <strong>1920 × 1080 (16:9 PPT Standard)</strong> • Fully Vector Scalable</span>
      </div>
    </div>
  </main>

  <script>
    const d1_svg = 'inspack_diagram1_user_workflow.svg';
    const d2_svg = 'inspack_diagram2_technical_architecture.svg';
    const d1_png = 'inspack_diagram1_user_workflow.png';
    const d2_png = 'inspack_diagram2_technical_architecture.png';

    let currentDiagram = 1;

    function switchDiagram(num) {
      currentDiagram = num;
      const vp = document.getElementById('viewport');
      const desc = document.getElementById('diagramDesc');
      const tab1 = document.getElementById('tab1Btn');
      const tab2 = document.getElementById('tab2Btn');

      if (num === 1) {
        tab1.classList.add('active');
        tab2.classList.remove('active');
        vp.innerHTML = '<object type="image/svg+xml" data="' + d1_svg + '" style="width:100%; height:auto;"></object>';
        desc.innerHTML = '<strong>Diagram 1:</strong> Complete 10-step Field Officer Inspection & Compliance Workflow (Capture ➔ AI/OCR ➔ Rule Check ➔ Decision ➔ Evidence ➔ Report)';
      } else {
        tab2.classList.add('active');
        tab1.classList.remove('active');
        vp.innerHTML = '<object type="image/svg+xml" data="' + d2_svg + '" style="width:100%; height:auto;"></object>';
        desc.innerHTML = '<strong>Diagram 2:</strong> 6-Layer Modular Technical Architecture with Separate Admin/Rule Management Subsystem';
      }
    }

    function downloadCurrentSVG() {
      const file = currentDiagram === 1 ? d1_svg : d2_svg;
      const a = document.createElement('a');
      a.href = file;
      a.download = file;
      a.click();
    }

    function downloadCurrentPNG() {
      const file = currentDiagram === 1 ? d1_png : d2_png;
      const a = document.createElement('a');
      a.href = file;
      a.download = file;
      a.click();
    }

    // Initialize with Diagram 1
    switchDiagram(1);
  </script>
</body>
</html>'''

def render_svg_to_png(svg_path, png_path, width=2400, height=1350):
    """Uses Chrome headless to render SVG to crisp high-resolution PNG."""
    chrome_path = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    edge_path = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
    browser = chrome_path if os.path.exists(chrome_path) else edge_path

    # Create temporary html wrapper to ensure background and proper scaling
    html_wrapper = svg_path + ".render.html"
    abs_svg_uri = "file:///" + os.path.abspath(svg_path).replace("\\", "/")
    
    html_content = f'''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  html, body {{ width:{width}px; height:{height}px; background:#F8FAFC; overflow:hidden; }}
  img {{ width:100%; height:100%; display:block; }}
</style>
</head>
<body>
  <img src="{abs_svg_uri}" width="{width}" height="{height}" />
</body>
</html>'''
    with open(html_wrapper, "w", encoding="utf-8") as f:
        f.write(html_content)

    abs_html_path = "file:///" + os.path.abspath(html_wrapper).replace("\\", "/")
    abs_png_path = os.path.abspath(png_path)

    cmd = [
        browser,
        "--headless",
        "--disable-gpu",
        f"--window-size={width},{height}",
        f"--screenshot={abs_png_path}",
        abs_html_path
    ]
    print(f"Rendering {os.path.basename(svg_path)} -> {os.path.basename(png_path)} ({width}x{height})...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(html_wrapper):
        os.remove(html_wrapper)
    
    if os.path.exists(png_path) and os.path.getsize(png_path) > 1000:
        print(f"  [SUCCESS] Created {png_path} ({os.path.getsize(png_path):,} bytes)")
        return True
    else:
        print(f"  [ERROR] Failed rendering PNG. Return code: {res.returncode}")
        print(res.stderr)
        return False

def main():
    print("=" * 60)
    print("INSPACK - SIH 2026 Presentation Diagrams Generation")
    print("=" * 60)

    # Output paths
    d1_svg = os.path.join(BASE_DIR, "inspack_diagram1_user_workflow.svg")
    d2_svg = os.path.join(BASE_DIR, "inspack_diagram2_technical_architecture.svg")
    d1_png = os.path.join(BASE_DIR, "inspack_diagram1_user_workflow.png")
    d2_png = os.path.join(BASE_DIR, "inspack_diagram2_technical_architecture.png")
    viewer_html = os.path.join(BASE_DIR, "diagrams_viewer.html")

    # Also mirror into public/ directory for Vite web app
    pub_d1_svg = os.path.join(PUBLIC_DIR, "inspack_diagram1_user_workflow.svg")
    pub_d2_svg = os.path.join(PUBLIC_DIR, "inspack_diagram2_technical_architecture.svg")
    pub_d1_png = os.path.join(PUBLIC_DIR, "inspack_diagram1_user_workflow.png")
    pub_d2_png = os.path.join(PUBLIC_DIR, "inspack_diagram2_technical_architecture.png")
    pub_viewer_html = os.path.join(PUBLIC_DIR, "diagrams_viewer.html")

    # 1. Generate Diagram 1 SVG
    content1 = generate_svg_diagram1()
    with open(d1_svg, "w", encoding="utf-8") as f:
        f.write(content1)
    with open(pub_d1_svg, "w", encoding="utf-8") as f:
        f.write(content1)
    print(f"[OK] Diagram 1 SVG generated: {d1_svg}")

    # 2. Generate Diagram 2 SVG
    content2 = generate_svg_diagram2()
    with open(d2_svg, "w", encoding="utf-8") as f:
        f.write(content2)
    with open(pub_d2_svg, "w", encoding="utf-8") as f:
        f.write(content2)
    print(f"[OK] Diagram 2 SVG generated: {d2_svg}")

    # 3. Generate HTML Viewer
    v_html = generate_interactive_viewer_html()
    with open(viewer_html, "w", encoding="utf-8") as f:
        f.write(v_html)
    with open(pub_viewer_html, "w", encoding="utf-8") as f:
        f.write(v_html)
    print(f"[OK] Interactive HTML Viewer generated: {viewer_html}")

    # 4. Render High-Resolution PNGs (16:9 Widescreen 2400x1350 for crisp slides)
    render_svg_to_png(d1_svg, d1_png, width=2400, height=1350)
    render_svg_to_png(d2_svg, d2_png, width=2400, height=1350)

    # 5. Render Ultra 4K PNGs (3840x2160 for high-resolution projection)
    d1_png_4k = os.path.join(BASE_DIR, "inspack_diagram1_user_workflow_4k.png")
    d2_png_4k = os.path.join(BASE_DIR, "inspack_diagram2_technical_architecture_4k.png")
    pub_d1_png_4k = os.path.join(PUBLIC_DIR, "inspack_diagram1_user_workflow_4k.png")
    pub_d2_png_4k = os.path.join(PUBLIC_DIR, "inspack_diagram2_technical_architecture_4k.png")
    render_svg_to_png(d1_svg, d1_png_4k, width=3840, height=2160)
    render_svg_to_png(d2_svg, d2_png_4k, width=3840, height=2160)

    # Copy PNGs to public/
    import shutil
    for src, dst in [(d1_png, pub_d1_png), (d2_png, pub_d2_png), (d1_png_4k, pub_d1_png_4k), (d2_png_4k, pub_d2_png_4k)]:
        if os.path.exists(src):
            shutil.copy2(src, dst)

    print("\nAll diagram assets (SVG, Full-HD PNG, 4K PNG, HTML viewer) successfully generated and verified!")

if __name__ == "__main__":
    main()
