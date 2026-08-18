import {
  Candidate,
  TeamMember,
  Voter,
  DeliveryLog,
  Complaint,
  Expense,
  Volunteer,
  Booth,
  VolunteerVoter,
  SymbolItem,
  LayoutStyle,
  FormatDimension,
  LocationData,
  DesignTemplate
} from '../types';

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'rameshwar',
    name: 'Rameshwar Patel',
    hindiName: 'रामेश्वर पटेल',
    post: 'Sarpanch (Gram Panchayat)',
    postType: 'sarpanch',
    constituency: 'Gram Panchayat Rampur (Ward 04)',
    symbol: '🚜',
    symbolName: 'Tractor (ट्रैक्टर)',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    slogan: 'गांव का समग्र विकास, हर घर विश्वास और खुशहाली!',
    votersCount: 3500,
    volunteersCount: 24,
    manifesto: '1. Clean 24x7 drinking water pipeline\n2. Concrete roads & covered drainage\n3. Tube well power subsidy for farmers'
  },
  {
    id: 'vikram',
    name: 'Vikram Singh Gurjar',
    hindiName: 'विक्रम सिंह गुर्जर',
    post: 'Panch (Ward)',
    postType: 'panch',
    constituency: 'Ward 02 – Patel Basti',
    symbol: '🌾',
    symbolName: 'Farmer (किसान)',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    slogan: 'युवा नेतृत्व, स्वच्छ पेयजल और पक्की सड़कें!',
    votersCount: 620,
    volunteersCount: 8,
    manifesto: '1. Paved concrete lane in Patel Basti\n2. Streetlights on school road\n3. Handpump maintenance'
  },
  {
    id: 'savitri',
    name: 'Savitri Bai Meena',
    hindiName: 'सावित्री बाई मीणा',
    post: 'Panch (Ward)',
    postType: 'panch',
    constituency: 'Ward 04 – Anganwadi Block',
    symbol: '☀️',
    symbolName: 'Sun (सूरज)',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    slogan: 'नारी सशक्तिकरण, बालिका शिक्षा और बेहतर स्वास्थ्य!',
    votersCount: 850,
    volunteersCount: 6,
    manifesto: '1. Anganwadi center upgrade\n2. Women SHG sewing training center\n3. Primary health clinic checkup'
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'team_01',
    name: 'Rameshwar Patel',
    role: 'Super Admin',
    roleTitle: 'Contesting Candidate (Owner)',
    ward: 'All Wards (Gram Panchayat Rampur)',
    phone: '+91 98290 14285',
    status: 'Active',
    votersHandled: 3500,
    addedDate: '01 Aug 2026'
  },
  {
    id: 'team_02',
    name: 'Rajesh Kumar Sharma',
    role: 'Admin',
    roleTitle: 'Campaign Operations Manager',
    ward: 'All Wards (Campaign HQ)',
    phone: '+91 94140 33812',
    status: 'Active',
    votersHandled: 1850,
    addedDate: '03 Aug 2026'
  },
  {
    id: 'team_03',
    name: 'Priya Sharma',
    role: 'Admin',
    roleTitle: 'Social Media & Broadcast Coordinator',
    ward: 'All Wards (Digital Cell)',
    phone: '+91 98288 99120',
    status: 'Active',
    votersHandled: 2850,
    addedDate: '06 Aug 2026'
  },
  {
    id: 'team_04',
    name: 'Kailash Saini',
    role: 'Volunteer',
    roleTitle: 'Booth 02 Incharge (Panna Pramukh)',
    ward: 'Ward 02 – Patel Basti',
    phone: '+91 97840 55190',
    status: 'Active',
    votersHandled: 45,
    addedDate: '08 Aug 2026'
  },
  {
    id: 'team_05',
    name: 'Mukesh Gurjar',
    role: 'Volunteer',
    roleTitle: 'Booth 01 Incharge (Youth Mobilizer)',
    ward: 'Ward 04 – Rampur HQ',
    phone: '+91 94140 88219',
    status: 'Active',
    votersHandled: 38,
    addedDate: '10 Aug 2026'
  },
  {
    id: 'team_06',
    name: 'Anita Kumari',
    role: 'Volunteer',
    roleTitle: 'Women SHG Field Lead',
    ward: 'Ward 01 – Old Village',
    phone: '+91 96021 66723',
    status: 'Active',
    votersHandled: 29,
    addedDate: '12 Aug 2026'
  }
];

export const INITIAL_VOTERS: Voter[] = [
  { id: 'V-04-101', name: 'Rameshwar Patel', age: 48, gender: 'Male', ward: 'Ward 04', mobile: '+91 98290 14285', channel: 'WhatsApp', consent: 'Verified', source: 'Official Roll', status: 'Valid' },
  { id: 'V-04-102', name: 'Sita Devi Patel', age: 42, gender: 'Female', ward: 'Ward 04', mobile: '+91 98290 14286', channel: 'WhatsApp', consent: 'Verified', source: 'Official Roll', status: 'Valid' },
  { id: 'V-02-103', name: 'Gopal Lal Gurjar', age: 58, gender: 'Male', ward: 'Ward 02', mobile: '+91 97840 55190', channel: 'SMS Only', consent: 'Pending', source: 'Booth Survey', status: 'Valid' },
  { id: 'V-02-104', name: 'Kamla Devi Gurjar', age: 38, gender: 'Female', ward: 'Ward 02', mobile: '+91 96021 44556', channel: 'WhatsApp', consent: 'Verified', source: 'OCR Scan', status: 'Valid' },
  { id: 'V-01-105', name: 'Rahul Sharma', age: 22, gender: 'Male', ward: 'Ward 01', mobile: '+91 94140 11920', channel: 'WhatsApp', consent: 'Verified', source: 'Youth Drive', status: 'Valid' },
  { id: 'V-04-106', name: 'Kavita Meena', age: 24, gender: 'Female', ward: 'Ward 04', mobile: '+91 98288 33119', channel: 'WhatsApp', consent: 'Verified', source: 'Women SHG', status: 'Valid' },
  { id: 'V-03-107', name: 'Suraj Mal Jat', age: 65, gender: 'Male', ward: 'Ward 03', mobile: '', channel: 'SMS Only', consent: 'Missing Mobile', source: 'Official Roll', status: 'Missing Mobile' },
  { id: 'V-02-108', name: 'Sunil Kumar Gurjar', age: 21, gender: 'Male', ward: 'Ward 02', mobile: '+91 96021 77890', channel: 'WhatsApp', consent: 'Verified', source: 'Youth Drive', status: 'Valid' },
  { id: 'V-04-109', name: 'Manju Devi Saini', age: 35, gender: 'Female', ward: 'Ward 04', mobile: '+91 94140 88219', channel: 'WhatsApp', consent: 'Verified', source: 'Women SHG', status: 'Valid' },
  { id: 'V-01-110', name: 'Babulal Prajapat', age: 52, gender: 'Male', ward: 'Ward 01', mobile: '+91 98290 66451', channel: 'SMS Only', consent: 'Verified', source: 'Official Roll', status: 'Valid' }
];

export const INITIAL_DELIVERY_LOGS: DeliveryLog[] = [
  { id: '1', name: 'Rameshwar Patel', ward: 'Ward 04', mobile: '+91 98290 14285', route: 'WhatsApp', status: 'Delivered', read: 'Read (Blue Tick)', time: '10:45 AM' },
  { id: '2', name: 'Sita Devi Patel', ward: 'Ward 04', mobile: '+91 98290 14286', route: 'WhatsApp', status: 'Delivered', read: 'Read (Blue Tick)', time: '10:45 AM' },
  { id: '3', name: 'Gopal Lal Gurjar', ward: 'Ward 02', mobile: '+91 97840 55190', route: 'SMS Fallback', status: 'Delivered', read: 'N/A (SMS)', time: '10:46 AM' },
  { id: '4', name: 'Kamla Devi Gurjar', ward: 'Ward 02', mobile: '+91 96021 44556', route: 'WhatsApp', status: 'Delivered', read: 'Delivered ✓✓', time: '10:46 AM' },
  { id: '5', name: 'Rahul Sharma', ward: 'Ward 01', mobile: '+91 94140 11920', route: 'WhatsApp', status: 'Delivered', read: 'Read (Blue Tick)', time: '10:47 AM' },
  { id: '6', name: 'Suraj Mal Jat', ward: 'Ward 03', mobile: '+91 94140 00000', route: 'SMS Fallback', status: 'Delivered', read: 'N/A (SMS)', time: '10:48 AM' }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  { id: 'GR-101', organization_id: 'org_1', election_id: 'election_1', title: 'Water Supply Issue', description: 'Handpump non-functional near community well; water pipeline pressure low', category: 'Water Supply', status: 'IN_PROGRESS', reported_by_name: 'Suraj Mal Sharma', ward_name: 'Ward 04', created_at: '2026-08-15T00:00:00Z', updated_at: '2026-08-15T00:00:00Z' },
  { id: 'GR-102', organization_id: 'org_1', election_id: 'election_1', title: 'Health / School Issue', description: 'Primary health sub-center ANM nurse not available on Tuesdays', category: 'Health / School', status: 'OPEN', reported_by_name: 'Kavita Meena', ward_name: 'Ward 04', created_at: '2026-08-14T00:00:00Z', updated_at: '2026-08-14T00:00:00Z' },
  { id: 'GR-103', organization_id: 'org_1', election_id: 'election_1', title: 'Road Drainage Issue', description: 'Rainwater stagnation in front of primary school; drainage culvert choked', category: 'Road Drainage', status: 'RESOLVED', reported_by_name: 'Gopal Lal Gurjar', ward_name: 'Ward 02', created_at: '2026-08-12T00:00:00Z', updated_at: '2026-08-12T00:00:00Z' },
  { id: 'GR-104', organization_id: 'org_1', election_id: 'election_1', title: 'Electricity Problem', description: 'Low voltage during evening 6 to 9 PM; tube well pump trip issue', category: 'Electricity', status: 'IN_PROGRESS', reported_by_name: 'Sunil Kumar', ward_name: 'Ward 02', created_at: '2026-08-10T00:00:00Z', updated_at: '2026-08-10T00:00:00Z' },
  { id: 'GR-105', organization_id: 'org_1', election_id: 'election_1', title: 'Road Repair Needed', description: 'Kaccha road needs gravel paving before polling day', category: 'Road Drainage', status: 'OPEN', reported_by_name: 'Babulal Prajapat', ward_name: 'Ward 01', created_at: '2026-08-08T00:00:00Z', updated_at: '2026-08-08T00:00:00Z' }
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: 'exp_01', category: 'Pamphlet & Banner Printing', amount: 24500, date: '14 Aug 2026', note: 'Rampur Digital Flex Print (500 Pamphlets, 4 Hoardings)', mode: 'UPI / Online', user: 'Rajesh Kumar (Admin)' },
  { id: 'exp_02', category: 'Sound, DJ & Mic Rental', amount: 12000, date: '12 Aug 2026', note: 'Shree Ram Sound Service (Nukkad Sabha Ward 02 & 04)', mode: 'Cash Voucher', user: 'Rameshwar Patel (Candidate)' },
  { id: 'exp_03', category: 'Tea, Snacks & Volunteer Food', amount: 14250, date: '10 Aug 2026', note: 'Chai & Snacks for 24 Panna Pramukhs across 6 Booths', mode: 'UPI / Online', user: 'Rajesh Kumar (Admin)' },
  { id: 'exp_04', category: 'Vehicle Fuel & Transport', amount: 11500, date: '08 Aug 2026', note: 'Campaign Bolero diesel (Ward 01 to 06 village tour)', mode: 'Cash Voucher', user: 'Kailash Saini (Volunteer)' },
  { id: 'exp_05', category: 'Office & Panna Supplies', amount: 6200, date: '05 Aug 2026', note: 'Voter roll stationery, clipboards, pens & identity cards', mode: 'UPI / Online', user: 'Rajesh Kumar (Admin)' }
];

export const INITIAL_VOLUNTEERS: Volunteer[] = [
  { id: 'vol_1', name: 'Kailash Saini', role: 'Ward 02 Incharge', ward: 'Ward 02 (Booth 02 - Community Hall)', phone: '+91 94140 22910', votersAdded: 450, callsMade: 320, slipsDistributed: 540, status: 'Active' },
  { id: 'vol_2', name: 'Priya Sharma', role: 'Women SHG Coordinator', ward: 'Ward 04 (Booth 01 - Govt School)', phone: '+91 98288 12455', votersAdded: 620, callsMade: 480, slipsDistributed: 680, status: 'Active' },
  { id: 'vol_3', name: 'Mukesh Gurjar', role: 'Youth Mobilizer', ward: 'Ward 01 (Booth 03 - Panchayat Bhawan)', phone: '+91 96021 55901', votersAdded: 380, callsMade: 290, slipsDistributed: 420, status: 'Active' },
  { id: 'vol_4', name: 'Mahesh Sharma', role: 'Booth 04 Incharge', ward: 'Ward 03 (Booth 04 - Anganwadi Center)', phone: '+91 94140 77123', votersAdded: 310, callsMade: 210, slipsDistributed: 390, status: 'On-Duty' }
];

export const INITIAL_BOOTHS: Booth[] = [
  { boothNo: 'Booth 01', location: 'Govt Senior Secondary School, Rampur', incharge: 'Rajesh Kumar (+91 98290 14285)', voters: 850, slips: 748, coverage: '88%' },
  { boothNo: 'Booth 02', location: 'Panchayat Community Hall, Patel Basti', incharge: 'Kailash Saini (+91 94140 22910)', voters: 620, slips: 570, coverage: '92%' },
  { boothNo: 'Booth 03', location: 'Gram Panchayat Bhawan, Main Road', incharge: 'Mukesh Gurjar (+91 96021 55901)', voters: 580, slips: 490, coverage: '84%' },
  { boothNo: 'Booth 04', location: 'Anganwadi Center No. 2, Ward 03', incharge: 'Mahesh Sharma (+91 94140 77123)', voters: 510, slips: 420, coverage: '82%' },
  { boothNo: 'Booth 05', location: 'Primary Health Sub-Center, Ward 05', incharge: 'Suraj Bhan Meena (+91 97840 44109)', voters: 480, slips: 410, coverage: '85%' },
  { boothNo: 'Booth 06', location: 'Cooperative Society Hall, Ward 06', incharge: 'Dinesh Yadav (+91 98288 33110)', voters: 460, slips: 390, coverage: '84%' }
];

export const INITIAL_VOLUNTEER_VOTERS: VolunteerVoter[] = [
  { id: 'V-02-101', name: 'Gopal Lal Gurjar', age: 58, mobile: '+91 97840 55190', house: 'House #14, Patel Chowk', status: 'Visited', slipHanded: true },
  { id: 'V-02-102', name: 'Kamla Devi Gurjar', age: 38, mobile: '+91 96021 44556', house: 'House #19, Basti Lane 2', status: 'Called', slipHanded: true },
  { id: 'V-02-103', name: 'Vikram Singh Jat', age: 31, mobile: '+91 94140 99881', house: 'House #22, Near Water Tank', status: 'Visited', slipHanded: true },
  { id: 'V-02-104', name: 'Mohan Lal Saini', age: 45, mobile: '+91 98290 33412', house: 'House #08, Main Chowk', status: 'Pending', slipHanded: false },
  { id: 'V-02-105', name: 'Shanti Devi', age: 52, mobile: '+91 94140 11920', house: 'House #31, School Road', status: 'Called', slipHanded: true },
  { id: 'V-02-106', name: 'Sunil Kumar Gurjar', age: 24, mobile: '+91 96021 77890', house: 'House #11, Basti Lane 1', status: 'Not Reachable', slipHanded: false }
];

export const SYMBOLS_DATABASE: SymbolItem[] = [
  { symbol: '🚜', name: 'Tractor (ट्रैक्टर)', keywords: 'tractor kisan khet kheti gaon vehicle' },
  { symbol: '🌾', name: 'Farmer / Wheat (किसान/गेहूं)', keywords: 'farmer wheat crop grain fasal khet' },
  { symbol: '☀️', name: 'Sun (सूरज)', keywords: 'sun suraj prakash roshni din light' },
  { symbol: '🔦', name: 'Torch (मशाल/टॉर्च)', keywords: 'torch mashal light batti roshni' },
  { symbol: '🪁', name: 'Kite (पतंग)', keywords: 'kite patang hawa sky guddi' },
  { symbol: '☕', name: 'Cup & Saucer (कप-प्लेट)', keywords: 'cup chai tea coffee plate' },
  { symbol: '🪷', name: 'Lotus (कमल)', keywords: 'lotus kamal phool flower jal' },
  { symbol: '✋', name: 'Hand (हाथ)', keywords: 'hand hath palm panja vishwas' },
  { symbol: '🏏', name: 'Cricket Bat (बल्ला)', keywords: 'bat balla cricket khel sport' },
  { symbol: '⚽', name: 'Football (फुटबॉल)', keywords: 'football ball khel soccer' },
  { symbol: '🛺', name: 'Auto Rickshaw (ऑटो)', keywords: 'auto rickshaw tempo gadi' },
  { symbol: '⛽', name: 'Gas Cylinder (सिलेंडर)', keywords: 'gas cylinder lpg rasoi kitchen' },
  { symbol: '🧵', name: 'Sewing Machine (सिलाई मशीन)', keywords: 'sewing machine silai darzi kapda' },
  { symbol: '🪜', name: 'Ladder (सीढ़ी)', keywords: 'ladder sidhi vikas uchi step' },
  { symbol: '🌀', name: 'Ceiling Fan (पंखा)', keywords: 'fan pankha bijli hawa cool' },
  { symbol: '💡', name: 'Electric Bulb (बल्ब)', keywords: 'bulb bijli light roshni ujala' },
  { symbol: '🔔', name: 'Temple Bell (घंटी)', keywords: 'bell ghanti mandir aawaz' },
  { symbol: '🔐', name: 'Lock & Key (ताला-चाबी)', keywords: 'lock key tala chabi suraksha' },
  { symbol: '✒️', name: 'Pen Nib (कलम)', keywords: 'pen kalam nib shiksha lekhak' },
  { symbol: '📖', name: 'Open Book (किताब)', keywords: 'book kitab pustak vidya vidyalaya' },
  { symbol: '🗄️', name: 'Almirah (अलमारी)', keywords: 'almirah almari tijori box' },
  { symbol: '📺', name: 'Television (टीवी)', keywords: 'tv television chitra door' },
  { symbol: '📻', name: 'Radio (रेडियो)', keywords: 'radio aakashvani khabar sangeet' },
  { symbol: '🪣', name: 'Bucket (बाल्टी)', keywords: 'bucket balti pani water nalka' },
  { symbol: '☂️', name: 'Umbrella (छाता)', keywords: 'umbrella chata barish shadow' },
  { symbol: '✂️', name: 'Scissors (कैंची)', keywords: 'scissors kainchi darzi cut' },
  { symbol: '🫖', name: 'Tea Kettle (केतली)', keywords: 'kettle ketli chai garam' },
  { symbol: '🍲', name: 'Pressure Cooker (कुकर)', keywords: 'cooker kitchen rasoi khana' },
  { symbol: '🍎', name: 'Apple (सेब)', keywords: 'apple seb fal fruit swasthya' },
  { symbol: '🥭', name: 'Mango (आम)', keywords: 'mango aam fal fruit meetha' },
  { symbol: '🌹', name: 'Rose (गुलाब)', keywords: 'rose gulab phool flower sundar' },
  { symbol: '🌴', name: 'Coconut Tree (नारियल पेड़)', keywords: 'coconut tree nariyal ped vriksh' },
  { symbol: '⛵', name: 'Boat (नाव)', keywords: 'boat naav nadi jal pani' },
  { symbol: '🚚', name: 'Truck (ट्रक)', keywords: 'truck tempo transport gadi' },
  { symbol: '🚲', name: 'Bicycle (साइकिल)', keywords: 'bicycle cycle sawari pair' },
  { symbol: '🏍️', name: 'Motorcycle (मोटरसाइकिल)', keywords: 'motorcycle bike gadi speed' },
  { symbol: '🐘', name: 'Elephant (हाथी)', keywords: 'elephant hathi shakti animal' },
  { symbol: '🦁', name: 'Lion (शेर)', keywords: 'lion sher sahas jungle king' },
  { symbol: '🐎', name: 'Horse (घोड़ा)', keywords: 'horse ghoda tezi shakti speed' },
  { symbol: '🏹', name: 'Bow & Arrow (धनुष-बाण)', keywords: 'bow arrow dhanush teer lakshya' },
  { symbol: '⚖️', name: 'Scales (तराजू)', keywords: 'scales tarazu nyay barabar samta' },
  { symbol: '📷', name: 'Camera (कैमरा)', keywords: 'camera photo tasveer' },
  { symbol: '💍', name: 'Diamond Ring (अंगूठी)', keywords: 'ring angoothi gehna sone' },
  { symbol: '🔑', name: 'Key (चाबी)', keywords: 'key chabi tala rahasya' },
  { symbol: '🕯️', name: 'Candle (मोमबत्ती)', keywords: 'candle mombatti roshni ujala' },
  { symbol: '🏺', name: 'Water Pot / Matka (मटका)', keywords: 'pot matka ghada pani thanda' },
  { symbol: '🍍', name: 'Pineapple (अनानास)', keywords: 'pineapple ananas fal fruit' },
  { symbol: '🥥', name: 'Coconut (नारियल)', keywords: 'coconut nariyal shubh puja' },
  { symbol: '☸️', name: 'Wheel (पहिया/चक्र)', keywords: 'wheel chakra pahiya pragati vikas' },
  { symbol: '🎺', name: 'Trumpet (तुरही/बिगुल)', keywords: 'trumpet turhi bigul jeet' },
  { symbol: '🥁', name: 'Dholak / Drum (ढोलक)', keywords: 'dholak drum sangeet utsav' }
];

export const LAYOUT_STYLES: LayoutStyle[] = [
  { id: 'layout-center', name: '🏛️ Grand Centerpiece', desc: 'Framed portrait centered with golden arch & symbol ribbon', category: 'Classic' },
  { id: 'layout-split', name: '⚡ Split Power Banner', desc: 'High-contrast split: candidate photo left, bold slogans right', category: 'Modern' },
  { id: 'layout-triband', name: '🇮🇳 Tri-Band Festive', desc: 'Tricolor header ribbon, golden ring badge & voting date footer', category: 'National' },
  { id: 'layout-social', name: '📱 Social Story (9:16)', desc: 'Full vertical story layout with floating symbol badge', category: 'Digital' },
  { id: 'layout-arch', name: '👑 Golden Arch Majestic', desc: 'Royal golden border arch with prominent candidate title', category: 'Classic' },
  { id: 'layout-ribbon', name: '🎗️ Slogan Ribbon Accent', desc: 'High-visibility slogan banner band with manifesto callout', category: 'Bold' }
];

export const FORMAT_DIMENSIONS: FormatDimension[] = [
  { id: 'pamphlet-a5', name: 'A5 Handbill Pamphlet', dims: '148 × 210 mm (1748 × 2480 px)', width: 600, height: 848, ratio: 'A5', tag: 'print' },
  { id: 'flex-3x6', name: '3×6 ft Road Hoarding', dims: '36 × 72 in (Full HD Print)', width: 450, height: 900, ratio: '1:2', tag: 'print' },
  { id: 'flex-4x8', name: '4×8 ft Grand Stage Flex', dims: '48 × 96 in (Mega Canvas)', width: 450, height: 900, ratio: '1:2', tag: 'print' },
  { id: 'wa-status', name: 'WhatsApp & Insta Story', dims: '1080 × 1920 px (9:16 Vertical)', width: 450, height: 800, ratio: '9:16', tag: 'social' },
  { id: 'fb-square', name: 'FB / WhatsApp Square Post', dims: '1080 × 1080 px (1:1 Ratio)', width: 600, height: 600, ratio: '1:1', tag: 'social' },
  { id: 'panna-slip', name: 'Panna Voter Slip (Pocket)', dims: '3.5 × 2.0 in (Micro ID)', width: 600, height: 350, ratio: '7:4', tag: 'print' }
];

export const MAP_LOCATIONS: Record<string, LocationData> = {
  rampur: {
    name: 'Gram Panchayat Rampur',
    district: 'Jaipur Rural, Rajasthan',
    totalWards: 11,
    totalBooths: 6,
    registeredVoters: '4,850',
    turnoutTarget: '85%',
    sensitiveBooths: '1 of 6',
    centerOffset: { x: 0, y: 0 },
    booths: [
      { id: 1, name: 'Booth 01 – Panchayat Bhawan', voters: 820, turnout: '82%', sensitive: 'Normal', incharge: 'Kailash Saini', x: 260, y: 220 },
      { id: 2, name: 'Booth 02 – Govt Senior Sec. School', voters: 1140, turnout: '78%', sensitive: 'Sensitive', incharge: 'Mahesh Sharma', x: 420, y: 190 },
      { id: 3, name: 'Booth 03 – Community Health Centre', voters: 950, turnout: '88%', sensitive: 'Normal', incharge: 'Anita Verma', x: 340, y: 350 },
      { id: 4, name: 'Booth 04 – Kisan Sewa Kendra', voters: 780, turnout: '91%', sensitive: 'Normal', incharge: 'Suresh Patel', x: 520, y: 320 },
      { id: 5, name: 'Booth 05 – Anganwadi Centre 02', voters: 610, turnout: '80%', sensitive: 'Normal', incharge: 'Rekha Devi', x: 200, y: 380 },
      { id: 6, name: 'Booth 06 – Govt Primary School West', voters: 550, turnout: '75%', sensitive: 'Normal', incharge: 'Pappu Lal', x: 180, y: 150 }
    ]
  },
  shivaji: {
    name: 'Ward 12 – Shivaji Nagar',
    district: 'Urban Ward, Zone 4',
    totalWards: 1,
    totalBooths: 4,
    registeredVoters: '3,200',
    turnoutTarget: '75%',
    sensitiveBooths: '0 of 4',
    centerOffset: { x: 30, y: -20 },
    booths: [
      { id: 1, name: 'Booth 01 – Shivaji High School', voters: 980, turnout: '74%', sensitive: 'Normal', incharge: 'Vivek Joshi', x: 280, y: 240 },
      { id: 2, name: 'Booth 02 – Municipal Hall Block B', voters: 890, turnout: '79%', sensitive: 'Normal', incharge: 'Pooja Jain', x: 400, y: 210 },
      { id: 3, name: 'Booth 03 – Community Center Park', voters: 710, turnout: '81%', sensitive: 'Normal', incharge: 'Sunil Rao', x: 360, y: 340 }
    ]
  }
};

// ── Mock Design Templates for Poster Generator ──────────────────────────────
export const DESIGN_TEMPLATES: DesignTemplate[] = [
  {
    id: 'template-poster-tricolor',
    organization_id: null,
    name: 'Tricolor Poster – Portrait',
    election_type: 'panchayat',
    category: 'poster',
    format_name: 'A4 Poster',
    format_dims: '210 × 297 mm',
    thumbnail_url: 'https://images.unsplash.com/photo-1589939705066-5ec8b3b47f1d?w=200&h=280&crop=faces&fit=crop',
    is_active: true,
    display_order: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    layout_json: {
      bg_color: '#ffffff',
      width: 600,
      height: 848,
      elements: [
        { type: 'shape', x: 0, y: 0, width: 600, height: 130, color: '#ff9933', value: 'tricolor-top', z_index: 1 },
        { type: 'shape', x: 0, y: 130, width: 600, height: 130, color: '#ffffff', value: 'tricolor-mid', z_index: 1 },
        { type: 'shape', x: 0, y: 260, width: 600, height: 130, color: '#138808', value: 'tricolor-bot', z_index: 1 },
        { type: 'text', x: 10, y: 350, width: 580, height: 80, placeholder: '{{candidate_name}}', font_size: 48, font_weight: 'bold', color: '#000000', z_index: 3 },
        { type: 'text', x: 10, y: 430, width: 580, height: 60, placeholder: '{{position}}', font_size: 32, color: '#333333', z_index: 3 },
        { type: 'symbol', x: 450, y: 320, width: 120, height: 120, placeholder: '{{symbol}}', z_index: 4 },
        { type: 'text', x: 10, y: 500, width: 580, height: 100, placeholder: '{{slogan}}', font_size: 24, font_weight: 'bold', color: '#ff6b00', text_align: 'center', z_index: 3 },
        { type: 'text', x: 10, y: 620, width: 580, height: 50, value: 'Campaign 2026', font_size: 16, color: '#666666', text_align: 'center', z_index: 3 }
      ]
    }
  },
  {
    id: 'template-banner-landscape',
    organization_id: null,
    name: 'Campaign Banner – Landscape',
    election_type: 'panchayat',
    category: 'banner',
    format_name: 'Hoarding Banner',
    format_dims: '1200 × 600 px',
    thumbnail_url: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=300&h=150&crop=faces&fit=crop',
    is_active: true,
    display_order: 2,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    layout_json: {
      bg_color: '#0f172a',
      width: 1200,
      height: 600,
      elements: [
        { type: 'text', x: 20, y: 50, width: 550, height: 150, placeholder: '{{candidate_name}}', font_size: 64, font_weight: 'bold', color: '#ffffff', z_index: 2 },
        { type: 'photo', x: 50, y: 150, width: 400, height: 400, placeholder: 'candidate_photo', z_index: 1 },
        { type: 'symbol', x: 600, y: 150, width: 200, height: 200, placeholder: '{{symbol}}', z_index: 3 },
        { type: 'text', x: 600, y: 380, width: 550, height: 150, placeholder: '{{slogan}}', font_size: 40, font_weight: 'bold', color: '#fbbf24', text_align: 'center', z_index: 2 }
      ]
    }
  },
  {
    id: 'template-idcard-small',
    organization_id: null,
    name: 'ID Card – Vertical',
    election_type: 'panchayat',
    category: 'id_card',
    format_name: 'ID Card',
    format_dims: '90 × 150 mm',
    thumbnail_url: 'https://images.unsplash.com/photo-1549887534-f3d6f6a8f5a0?w=90&h=150&crop=faces&fit=crop',
    is_active: true,
    display_order: 3,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    layout_json: {
      bg_color: '#1e293b',
      width: 350,
      height: 560,
      elements: [
        { type: 'photo', x: 20, y: 20, width: 310, height: 200, placeholder: 'candidate_photo', z_index: 1 },
        { type: 'text', x: 10, y: 240, width: 330, height: 60, placeholder: '{{candidate_name}}', font_size: 24, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 2 },
        { type: 'text', x: 10, y: 310, width: 330, height: 40, placeholder: '{{position}}', font_size: 14, color: '#cbd5e1', text_align: 'center', z_index: 2 },
        { type: 'symbol', x: 135, y: 370, width: 80, height: 80, placeholder: '{{symbol}}', z_index: 2 },
        { type: 'text', x: 10, y: 470, width: 330, height: 40, placeholder: 'Ward {{ward_no}}', font_size: 12, color: '#94a3b8', text_align: 'center', z_index: 2 }
      ]
    }
  },
  {
    id: 'template-pamphlet-a5',
    organization_id: null,
    name: 'Handbill – A5 Pamphlet',
    election_type: 'panchayat',
    category: 'pamphlet',
    format_name: 'A5 Handbill',
    format_dims: '148 × 210 mm',
    thumbnail_url: 'https://images.unsplash.com/photo-1526628653108-1e9d772c8d5a?w=150&h=210&crop=faces&fit=crop',
    is_active: true,
    display_order: 4,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    layout_json: {
      bg_color: '#f8fafc',
      width: 600,
      height: 848,
      elements: [
        { type: 'text', x: 20, y: 40, width: 560, height: 80, value: 'Vote Smart • Vote Together', font_size: 36, font_weight: 'bold', color: '#0f172a', text_align: 'center', z_index: 2 },
        { type: 'photo', x: 80, y: 140, width: 440, height: 350, placeholder: 'candidate_photo', z_index: 1 },
        { type: 'text', x: 20, y: 510, width: 560, height: 70, placeholder: '{{candidate_name}}', font_size: 32, font_weight: 'bold', color: '#0f172a', text_align: 'center', z_index: 2 },
        { type: 'text', x: 20, y: 590, width: 560, height: 50, placeholder: '{{slogan}}', font_size: 18, color: '#475569', text_align: 'center', z_index: 2 },
        { type: 'text', x: 20, y: 660, width: 560, height: 40, placeholder: 'Contact: {{contact}}', font_size: 14, color: '#64748b', text_align: 'center', z_index: 2 }
      ]
    }
  }
];
