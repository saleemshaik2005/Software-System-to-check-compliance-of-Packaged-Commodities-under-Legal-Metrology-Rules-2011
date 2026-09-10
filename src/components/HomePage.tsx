import React from 'react';
import {
  Camera,
  Layers,
  Globe,
  Scale,
  BarChart3,
  Building2,
  BookOpen,
  Archive,
  PhoneCall,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { ActiveTab, AuthUser, Language, UserRole } from '../types';
import { getTranslation } from '../services/i18nService';

interface HomePageProps {
  currentUser: AuthUser | null;
  userRole: UserRole;
  setCurrentTab: (tab: ActiveTab) => void;
  onOpenVault: () => void;
  onOpenRulebook: () => void;
  onOpenGrievance?: () => void;
  currentLang?: Language;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentUser,
  userRole,
  setCurrentTab,
  onOpenVault,
  onOpenRulebook,
  onOpenGrievance,
  currentLang = 'en',
}) => {
  const getRoleTitle = () => {
    switch (userRole) {
      case 'OFFICER':
        return currentLang === 'hi' ? 'विधिक मापविज्ञान निरीक्षक' : currentLang === 'te' ? 'లీగల్ మెట్రాలజీ ఇన్‌స్పెక్టర్' : 'Legal Metrology Inspector';
      case 'CITIZEN':
        return currentLang === 'hi' ? 'नागरिक / उपभोक्ता' : currentLang === 'te' ? 'పౌరుడు / వినియోగదారుడు' : 'Citizen / Consumer';
      case 'MANUFACTURER':
        return currentLang === 'hi' ? 'निर्माता / पैकर' : currentLang === 'te' ? 'తయారీదారు / ప్యాకర్' : 'Manufacturer / Packer';
      case 'SURVEILLANCE':
        return currentLang === 'hi' ? 'राष्ट्रीय निगरानी प्रकोष्ठ' : currentLang === 'te' ? 'జాతీయ నిఘా విభాగం' : 'National Surveillance Directorate';
      case 'ADMIN':
        return currentLang === 'hi' ? 'प्रणाली व्यवस्थापक' : currentLang === 'te' ? 'సిస్టమ్ అడ్మినిస్ట్రేటర్' : 'Platform Administrator';
      default:
        return 'Authorized User';
    }
  };

  const navCards = [
    {
      id: 'upload',
      title: currentLang === 'hi' ? 'पैकेज स्कैन स्टूडियो' : currentLang === 'te' ? 'ప్యాకేజీ స్కాన్ స్టూడియో' : 'Package Scan Studio',
      desc: currentLang === 'hi' ? 'फ्रंट/बैक तस्वीरों को तुरंत कैप्चर करें और विधिक मापविज्ञान नियमों की पुष्टि करें।' : currentLang === 'te' ? 'ముందు/వెనుక ఫోటోలను క్యాప్చర్ చేసి చట్టబద్ధమైన నిబంధనలను ధృవీకరించండి.' : 'Capture front, back, and side panels for automated rule verification and OCR analysis.',
      icon: Camera,
      badge: 'Real-Time AI OCR',
      btnText: currentLang === 'hi' ? 'स्कैन शुरू करें' : currentLang === 'te' ? 'స్కాన్ ప్రారంభించండి' : 'Open Scan Studio',
      btnColor: 'bg-[#283618] hover:bg-[#1c2610] text-[#FEFAE0]',
      action: () => setCurrentTab('upload'),
    },
    {
      id: 'catalog',
      title: currentLang === 'hi' ? 'औद्योगिक बैच कैटलॉग' : currentLang === 'te' ? 'పారిశ్రామిక బ్యాచ్ కేటలాగ్' : 'Industrial Batch Catalog',
      desc: currentLang === 'hi' ? 'फ़ैक्टरी शेल्फ़ या बहु-उत्पाद तस्वीरों को स्वचालित रूप से क्रॉप करें और बल्क में जांचें।' : currentLang === 'te' ? 'ఫ్యాక్టరీ షెల్ఫ్ లేదా బహుళ ఫోటోలను ఆటో-క్రాప్ చేసి బల్క్ పరిశీలన చేయండి.' : 'Auto-crop plant shelf displays and cluster multi-panel factory runs for bulk inspection.',
      icon: Layers,
      badge: 'Factory Batch Auto-Crop',
      btnText: currentLang === 'hi' ? 'कैटलॉग जांचें' : currentLang === 'te' ? 'కేటలాగ్ పరిశీలించండి' : 'Launch Batch Inspector',
      btnColor: 'bg-[#606C38] hover:bg-[#4d572d] text-[#FEFAE0]',
      action: () => setCurrentTab('catalog'),
    },
    {
      id: 'ecommerce',
      title: currentLang === 'hi' ? 'डार्क स्टोर व ई-कॉमर्स ऑडिट' : currentLang === 'te' ? 'డార్క్ స్టోర్ & ఈ-కామర్స్ ఆడిట్' : 'Dark Store & E-Commerce Audit',
      desc: currentLang === 'hi' ? 'Blinkit, Zepto, Amazon, Flipkart से वास्तविक पैकेजिंग चित्र और घोषणाएं निकालें।' : currentLang === 'te' ? 'Blinkit, Zepto, Amazon, Flipkart నుండి అసలైన ప్యాకింగ్ వివరాలను సేకరించి పరిశీలించండి.' : 'Live URL scraping on Zepto, Blinkit & Amazon with genuine statutory declaration extraction.',
      icon: Globe,
      badge: 'Live URL Scraper',
      btnText: currentLang === 'hi' ? 'ई-कॉमर्स जांचें' : currentLang === 'te' ? 'ఈ-కామర్స్ తనిఖీ' : 'Audit Platform URL',
      btnColor: 'bg-[#BC6C25] hover:bg-[#96551d] text-white',
      action: () => setCurrentTab('ecommerce'),
    },
    {
      id: 'scanner',
      title: currentLang === 'hi' ? 'अनुपालन रिपोर्ट व स्कोरकार्ड' : currentLang === 'te' ? 'సమ్మతి నివేదిక & స్కోర్‌కార్డ్' : 'Compliance Audit & Scorecard',
      desc: currentLang === 'hi' ? '13 कानूनी मानकों, एमआरपी, शुद्ध मात्रा और फ़ॉन्ट ऊंचाइयों की पूर्ण रिपोर्ट देखें।' : currentLang === 'te' ? '13 చట్టబద్ధమైన నిబంధనలు, MRP, నికర పరిమాణం మరియు ఫాంట్ ఎత్తుల పూర్తి నివేదిక.' : 'Examine 13 statutory declarations, Table I font heights, and download Form A/B certificates.',
      icon: Scale,
      badge: '13 Statutory Checks',
      btnText: currentLang === 'hi' ? 'रिपोर्ट देखें' : currentLang === 'te' ? 'నివేదికను చూడండి' : 'View Audit Sheet',
      btnColor: 'bg-[#283618] hover:bg-[#1c2610] text-[#FEFAE0]',
      action: () => setCurrentTab('scanner'),
    },
    {
      id: 'analytics',
      title: currentLang === 'hi' ? 'निरीक्षक प्रवर्तन हब' : currentLang === 'te' ? 'ఇన్‌స్పెక్టర్ ఎన్‌ఫోర్స్‌మెంట్ హబ్' : 'Enforcement & Legal Notices',
      desc: currentLang === 'hi' ? 'धारा 15 के तहत निरीक्षण, 5वीं अनुसूची नमूनाकरण और धारा 36 कानूनी नोटिस जारी करें।' : currentLang === 'te' ? 'సెక్షన్ 15 తనిఖీలు, 5వ షెడ్యూల్ శాంప్లింగ్ మరియు సెక్షన్ 36 లీగల్ నోటీసుల నిర్వహణ.' : 'Manage Section 15 inspections, compounding penalties, and generate Section 36 notices.',
      icon: BarChart3,
      badge: 'Section 15 & 36 Powers',
      btnText: currentLang === 'hi' ? 'प्रवर्तन डैशबोर्ड' : currentLang === 'te' ? 'ఎన్‌ఫోర్స్‌మెంట్ డ్యాష్‌బోర్డ్' : 'Open Enforcement Hub',
      btnColor: 'bg-[#606C38] hover:bg-[#4d572d] text-[#FEFAE0]',
      action: () => setCurrentTab('analytics'),
    },
    {
      id: 'manufacturer',
      title: currentLang === 'hi' ? 'ब्रांड आर्टवर्क सिम्युलेटर' : currentLang === 'te' ? 'బ్రాండ్ ఆర్ట్‌వర్క్ సిమ్యులేటర్' : 'Artwork Pre-Check Simulator',
      desc: currentLang === 'hi' ? 'पैकेजिंग छपाई से पहले आर्टवर्क की जांच करें ताकि बाजार से जब्ती से बचा जा सके।' : currentLang === 'te' ? 'ప్రింటింగ్ ముందే ప్యాకేజింగ్ ఆర్ట్‌వర్క్‌ను తనిఖీ చేసి మార్కెట్ రీకాల్‌లను నివారించండి.' : 'Pre-pack validation for brands to verify font sizes, declarations, and MRP before printing.',
      icon: Building2,
      badge: 'Pre-Printing Validation',
      btnText: currentLang === 'hi' ? 'आर्टवर्क जांचें' : currentLang === 'te' ? 'ఆర్ట్‌వర్క్ తనిఖీ' : 'Launch Brand Simulator',
      btnColor: 'bg-[#BC6C25] hover:bg-[#96551d] text-white',
      action: () => setCurrentTab('manufacturer'),
    },
    {
      id: 'surveillance',
      title: currentLang === 'hi' ? 'राष्ट्रीय निगरानी हब' : currentLang === 'te' ? 'జాతీయ నిఘా హబ్' : 'National Surveillance Hub',
      desc: currentLang === 'hi' ? 'देशभर के उल्लंघनों, राज्यवार रैंकिंग और बार-बार नियम तोड़ने वालों का विश्लेषण।' : currentLang === 'te' ? 'దేశవ్యాప్త ఉల్లంఘనలు, రాష్ట్రాల ర్యాంకింగ్‌లు మరియు రిపీట్ అఫెండర్ల స్థూల విశ్లేషణ.' : 'Ministry macro trends, nationwide state rankings, seizure dossiers, and dark store indices.',
      icon: ShieldCheck,
      badge: 'Macro Seizure Trends',
      btnText: currentLang === 'hi' ? 'निगरानी हब' : currentLang === 'te' ? 'నిఘా హబ్' : 'Open Surveillance',
      btnColor: 'bg-[#283618] hover:bg-[#1c2610] text-[#FEFAE0]',
      action: () => setCurrentTab('surveillance'),
    },
    {
      id: 'rulebook',
      title: currentLang === 'hi' ? 'एलएमपीसी नियमावली 2011 (43 पृष्ठ)' : currentLang === 'te' ? 'LMPC గెజిట్ రూల్‌బుక్ (43 పేజీలు)' : 'Official LMPC Rulebook (43 Pages)',
      desc: currentLang === 'hi' ? 'भारत के राजपत्र के सभी अध्याय, अनुसूचियां और फ़ॉन्ट आकार तालिकाएं पढ़ें।' : currentLang === 'te' ? 'భారత రాజపత్రం యొక్క అన్ని అధ్యాయాలు, షెడ్యూల్‌లు మరియు ఫాంట్ టేబుల్స్.' : 'Complete gazette rules, Schedules I–VIII, Second Schedule standards, and font height tables.',
      icon: BookOpen,
      badge: 'Govt Gazette GSR 202(E)',
      btnText: currentLang === 'hi' ? 'नियमावली पढ़ें' : currentLang === 'te' ? 'రూల్‌బుక్ చదవండి' : 'Read Rulebook',
      btnColor: 'bg-[#606C38] hover:bg-[#4d572d] text-[#FEFAE0]',
      action: () => setCurrentTab('rulebook'),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Welcome Banner */}
      <section className="bg-gradient-to-br from-[#283618] to-[#1c2610] text-[#FEFAE0] rounded-3xl p-6 sm:p-10 shadow-xl border border-[#606C38]/50 relative overflow-hidden">
        {/* Subtle Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DDA15E]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#DDA15E] text-[#283618] shadow-xs">
              Smart India Hackathon 2026
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#606C38]/80 text-[#FEFAE0] border border-[#FEFAE0]/30">
              Problem ID: SIH-26034
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEFAE0]/20 text-[#FEFAE0] border border-[#FEFAE0]/30">
              Ministry of Consumer Affairs
            </span>
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/logos/inspack-logo.jpg"
                alt="Inspack Logo"
                className="h-12 w-auto object-contain rounded-xl border border-[#DDA15E]/50 shadow-md"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#FEFAE0]">
                in<span className="text-[#DDA15E]">spack</span>
              </h1>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#DDA15E] leading-snug">
              Software System to Check Compliance of Packaged Commodities under Legal Metrology Rules, 2011
            </h2>
            <p className="text-xs sm:text-sm text-[#FEFAE0]/80 leading-relaxed mt-2">
              An intelligent, end-to-end automated platform engineered for enforcement officers, manufacturers, and citizens to eliminate misleading packaged goods, verify Table I numeral font heights, inspect dark store listings, and enforce statutory fair-packaging laws.
            </p>
          </div>

          {/* User Session Bar */}
          {currentUser && (
            <div className="pt-3 border-t border-[#606C38]/50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#DDA15E] text-[#283618] flex items-center justify-center font-black text-sm shadow-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-black text-[#FEFAE0] flex items-center gap-2">
                    <span>{currentUser.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#606C38] text-[#FEFAE0]">
                      {userRole}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#DDA15E] font-medium">
                    {getRoleTitle()} • Active Session
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('profile')}
                  className="px-3 py-1.5 rounded-xl bg-[#FEFAE0]/15 hover:bg-[#FEFAE0]/25 text-[#FEFAE0] text-xs font-bold transition-colors cursor-pointer border border-[#FEFAE0]/30"
                >
                  View Profile & Powers
                </button>
                <button
                  onClick={onOpenVault}
                  className="px-3 py-1.5 rounded-xl bg-[#DDA15E] hover:bg-[#c98e4d] text-[#283618] text-xs font-black transition-colors cursor-pointer shadow-xs"
                >
                  Inspection Vault
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Feature Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#283618] tracking-tight">
              Explore Inspection & Verification Modules
            </h2>
            <p className="text-xs text-[#606C38]">
              Select any capability below to begin automated compliance testing or review statutory dossiers.
            </p>
          </div>
          <span className="hidden sm:inline text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#F4EED4] text-[#283618] border border-[#DDA15E]/50">
            8 Direct Portals
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {navCards.map((card) => {
            const IconComp = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl p-5 border border-[#DDA15E]/40 hover:border-[#283618] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-[#F4EED4] text-[#283618] group-hover:bg-[#283618] group-hover:text-[#FEFAE0] transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#F4EED4] text-[#BC6C25] border border-[#DDA15E]/50">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-[#283618] group-hover:text-[#BC6C25] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#606C38] mt-1.5 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-[#DDA15E]/20">
                  <button
                    onClick={card.action}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${card.btnColor}`}
                  >
                    <span>{card.btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Access Utility Bar */}
      <section className="bg-[#F4EED4]/70 border border-[#DDA15E]/50 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#283618] text-[#FEFAE0]">
            <Sparkles className="w-5 h-5 text-[#DDA15E]" />
          </div>
          <div>
            <h4 className="text-sm font-black text-[#283618]">
              Need Official Legal Gazette Rules or Need to File a Grievance?
            </h4>
            <p className="text-xs text-[#606C38]">
              Access full 43-page Gazette notifications or submit 1-tap complaints directly to National Consumer Helpline 1915.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentTab('rulebook')}
            className="px-4 py-2 rounded-xl bg-[#283618] hover:bg-[#1c2610] text-[#FEFAE0] text-xs font-black transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#DDA15E]" />
            <span>Read 43-Page Rulebook</span>
          </button>
          {onOpenGrievance && (
            <button
              onClick={onOpenGrievance}
              className="px-4 py-2 rounded-xl bg-[#BC6C25] hover:bg-[#96551d] text-white text-xs font-black transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Helpline 1915 Grievance</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
