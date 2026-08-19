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
    name: '🇮🇳 Tricolor Grand Poster (A4/A5)',
    election_type: 'panchayat',
    category: 'poster',
    format_name: 'A4 Poster',
    format_dims: '600 × 848 px',
    thumbnail_url: 'https://images.unsplash.com/photo-1589939705066-5ec8b3b47f1d?w=300&h=424&crop=faces&fit=crop',
    is_active: true,
    display_order: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    layout_json: {
      bg_color: '#ffffff',
      width: 600,
      height: 848,
      elements: [
        // Background Bands
        { type: 'shape', x: 0, y: 0, width: 600, height: 110, color: '#ff9933', z_index: 1 },
        { type: 'shape', x: 0, y: 110, width: 600, height: 628, color: '#ffffff', z_index: 1 },
        { type: 'shape', x: 0, y: 738, width: 600, height: 110, color: '#138808', z_index: 1 },
        
        // Header Text
        { type: 'text', x: 10, y: 12, width: 580, height: 30, value: '॥ जय जवान • जय किसान • जय ग्राम स्वराज ॥', font_size: 16, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 },
        { type: 'text', x: 10, y: 48, width: 580, height: 48, placeholder: '{{headline}}', font_size: 24, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 },
        
        // Candidate Photo
        { type: 'photo', x: 45, y: 130, width: 220, height: 220, placeholder: 'candidate_photo', border_width: 5, border_color: '#ff9933', z_index: 2 },
        
        // Ballot No Tag above symbol
        { type: 'shape', x: 380, y: 120, width: 130, height: 26, color: '#dc2626', border_radius: 6, z_index: 4 },
        { type: 'text', x: 380, y: 120, width: 130, height: 26, placeholder: 'क्रम सं. {{ballot_no}}', font_size: 12, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 5 },

        // Symbol Box
        { type: 'symbol', x: 335, y: 150, width: 220, height: 200, placeholder: '{{symbol}}', bg_color: '#ffffff', border_width: 3, border_color: '#d97706', border_radius: 16, z_index: 3 },
        
        // Candidate Name & Details
        { type: 'text', x: 20, y: 375, width: 560, height: 55, placeholder: '{{candidate_name}}', font_size: 28, font_weight: 'bold', color: '#0f172a', text_align: 'center', z_index: 3 },
        { type: 'text', x: 20, y: 435, width: 560, height: 32, placeholder: '{{position}}', font_size: 19, font_weight: 'bold', color: '#334155', text_align: 'center', z_index: 3 },
        { type: 'text', x: 20, y: 470, width: 560, height: 28, placeholder: '{{constituency}}', font_size: 16, color: '#0284c7', text_align: 'center', z_index: 3 },
        
        // Slogan Ribbon
        { type: 'shape', x: 30, y: 512, width: 540, height: 58, color: '#fef3c7', border_width: 2, border_color: '#f59e0b', border_radius: 12, z_index: 2 },
        { type: 'text', x: 40, y: 516, width: 520, height: 50, placeholder: '"{{slogan}}"', font_size: 15, font_weight: 'bold', color: '#92400e', text_align: 'center', z_index: 3 },
        
        // Voting Date
        { type: 'text', x: 20, y: 590, width: 560, height: 30, placeholder: '{{voting_date}}', font_size: 15, font_weight: 'bold', color: '#475569', text_align: 'center', z_index: 3 },

        // Footer Appeal
        { type: 'shape', x: 16, y: 748, width: 568, height: 85, color: '#0f172a', border_radius: 8, z_index: 3 },
        { type: 'text', x: 25, y: 752, width: 550, height: 75, placeholder: 'चुनाव चिन्ह "{{symbol_name}}" के सामने वाला बटन दबाकर भारी मतों से विजयी बनाएं!', font_size: 17, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 4 }
      ]
    }
  },
  {
    id: 'template-banner-landscape',
    organization_id: null,
    name: '⚡ High-Impact Road Banner (3×6 ft)',
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
        // Candidate Photo Left
        { type: 'photo', x: 50, y: 90, width: 420, height: 420, placeholder: 'candidate_photo', border_width: 6, border_color: '#f59e0b', z_index: 2 },
        
        // Header
        { type: 'text', x: 500, y: 30, width: 660, height: 40, placeholder: '{{headline}}', font_size: 24, font_weight: 'bold', color: '#38bdf8', text_align: 'left', z_index: 3 },
        
        // Candidate Name
        { type: 'text', x: 500, y: 75, width: 660, height: 65, placeholder: '{{candidate_name}}', font_size: 38, font_weight: 'bold', color: '#ffffff', text_align: 'left', z_index: 3 },
        { type: 'text', x: 500, y: 145, width: 660, height: 35, placeholder: '{{position}} • {{constituency}}', font_size: 20, font_weight: 'bold', color: '#cbd5e1', text_align: 'left', z_index: 3 },
        
        // Symbol + Ballot Tag Right
        { type: 'shape', x: 500, y: 195, width: 140, height: 140, color: '#ffffff', border_width: 3, border_color: '#f59e0b', border_radius: 16, z_index: 2 },
        { type: 'symbol', x: 500, y: 195, width: 140, height: 140, placeholder: '{{symbol}}', z_index: 3 },
        
        { type: 'shape', x: 670, y: 195, width: 180, height: 35, color: '#dc2626', border_radius: 8, z_index: 3 },
        { type: 'text', x: 670, y: 195, width: 180, height: 35, placeholder: 'क्रम सं. {{ballot_no}}', font_size: 16, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 4 },

        { type: 'text', x: 670, y: 240, width: 490, height: 95, placeholder: '"{{slogan}}"', font_size: 21, font_weight: 'bold', color: '#fbbf24', text_align: 'left', z_index: 3 },

        // Bottom Banner
        { type: 'shape', x: 0, y: 520, width: 1200, height: 80, color: '#d97706', z_index: 2 },
        { type: 'text', x: 20, y: 525, width: 1160, height: 68, placeholder: 'मतदान: {{voting_date}} | चुनाव चिन्ह "{{symbol_name}}" पर मोहर लगाएं', font_size: 22, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 }
      ]
    }
  },
  {
    id: 'template-social-story',
    organization_id: null,
    name: '📱 WhatsApp & Instagram Story (9:16)',
    election_type: 'panchayat',
    category: 'social',
    format_name: 'Story 9:16',
    format_dims: '540 × 960 px',
    thumbnail_url: 'https://images.unsplash.com/photo-1549887534-f3d6f6a8f5a0?w=270&h=480&crop=faces&fit=crop',
    is_active: true,
    display_order: 3,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    layout_json: {
      bg_color: '#1e1b4b',
      width: 540,
      height: 960,
      elements: [
        // Header
        { type: 'text', x: 20, y: 25, width: 500, height: 35, value: '॥ आपका विश्वास • हमारा प्रयास ॥', font_size: 15, font_weight: 'bold', color: '#fbbf24', text_align: 'center', z_index: 3 },
        { type: 'text', x: 20, y: 62, width: 500, height: 40, placeholder: '{{headline}}', font_size: 22, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 },

        // Candidate Photo
        { type: 'photo', x: 120, y: 115, width: 300, height: 300, placeholder: 'candidate_photo', border_width: 6, border_color: '#f59e0b', z_index: 2 },
        
        // Name & Post
        { type: 'text', x: 20, y: 435, width: 500, height: 50, placeholder: '{{candidate_name}}', font_size: 26, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 },
        { type: 'text', x: 20, y: 490, width: 500, height: 32, placeholder: '{{position}}', font_size: 18, font_weight: 'bold', color: '#38bdf8', text_align: 'center', z_index: 3 },
        { type: 'text', x: 20, y: 525, width: 500, height: 28, placeholder: '{{constituency}}', font_size: 15, color: '#cbd5e1', text_align: 'center', z_index: 3 },

        // Symbol Box & Ballot
        { type: 'shape', x: 200, y: 580, width: 140, height: 140, color: '#ffffff', border_width: 3, border_color: '#f59e0b', border_radius: 16, z_index: 2 },
        { type: 'symbol', x: 200, y: 580, width: 140, height: 140, placeholder: '{{symbol}}', z_index: 3 },
        
        { type: 'shape', x: 205, y: 560, width: 130, height: 26, color: '#dc2626', border_radius: 6, z_index: 4 },
        { type: 'text', x: 205, y: 560, width: 130, height: 26, placeholder: 'क्रम सं. {{ballot_no}}', font_size: 12, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 5 },

        // Slogan
        { type: 'text', x: 20, y: 740, width: 500, height: 55, placeholder: '"{{slogan}}"', font_size: 16, font_weight: 'bold', color: '#fbbf24', text_align: 'center', z_index: 3 },

        // Footer
        { type: 'shape', x: 20, y: 825, width: 500, height: 95, color: '#d97706', border_radius: 12, z_index: 2 },
        { type: 'text', x: 30, y: 835, width: 480, height: 75, placeholder: '{{voting_date}}\nचुनाव चिन्ह "{{symbol_name}}" पर मतदान करें!', font_size: 16, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 }
      ]
    }
  },
  {
    id: 'template-pamphlet-a5',
    organization_id: null,
    name: '🏷️ Panna Voter Slip / Pocket Card',
    election_type: 'panchayat',
    category: 'pamphlet',
    format_name: 'Panna Slip',
    format_dims: '400 × 600 px',
    thumbnail_url: 'https://images.unsplash.com/photo-1526628653108-1e9d772c8d5a?w=200&h=300&crop=faces&fit=crop',
    is_active: true,
    display_order: 4,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    layout_json: {
      bg_color: '#fefce8',
      width: 400,
      height: 600,
      elements: [
        { type: 'shape', x: 0, y: 0, width: 400, height: 55, color: '#ca8a04', z_index: 1 },
        { type: 'text', x: 10, y: 10, width: 380, height: 35, value: 'मतदान मार्गदर्शिका / VOTER SLIP', font_size: 16, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 },
        
        { type: 'photo', x: 25, y: 75, width: 140, height: 140, placeholder: 'candidate_photo', border_width: 3, border_color: '#ca8a04', z_index: 2 },
        { type: 'symbol', x: 235, y: 75, width: 140, height: 140, placeholder: '{{symbol}}', bg_color: '#ffffff', border_width: 2, border_color: '#ca8a04', border_radius: 12, z_index: 2 },

        { type: 'shape', x: 250, y: 62, width: 110, height: 22, color: '#dc2626', border_radius: 4, z_index: 4 },
        { type: 'text', x: 250, y: 62, width: 110, height: 22, placeholder: 'क्रम सं. {{ballot_no}}', font_size: 11, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 5 },

        { type: 'text', x: 15, y: 230, width: 370, height: 38, placeholder: '{{candidate_name}}', font_size: 18, font_weight: 'bold', color: '#0f172a', text_align: 'center', z_index: 3 },
        { type: 'text', x: 15, y: 272, width: 370, height: 28, placeholder: '{{position}} • {{constituency}}', font_size: 13, font_weight: 'bold', color: '#475569', text_align: 'center', z_index: 3 },
        
        { type: 'shape', x: 20, y: 310, width: 360, height: 55, color: '#fef3c7', border_width: 1, border_color: '#ca8a04', border_radius: 8, z_index: 2 },
        { type: 'text', x: 30, y: 315, width: 340, height: 45, placeholder: '"{{slogan}}"', font_size: 12, font_weight: 'bold', color: '#92400e', text_align: 'center', z_index: 3 },
        
        { type: 'text', x: 15, y: 385, width: 370, height: 30, placeholder: '{{voting_date}}', font_size: 13, color: '#64748b', text_align: 'center', z_index: 3 },

        { type: 'shape', x: 15, y: 490, width: 370, height: 85, color: '#0f172a', border_radius: 8, z_index: 2 },
        { type: 'text', x: 20, y: 495, width: 360, height: 75, placeholder: 'चुनाव चिन्ह "{{symbol_name}}" के सामने वाला बटन दबाएं', font_size: 14, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 }
      ]
    }
  },
  {
    id: 'template-poster-golden-arch',
    organization_id: null,
    name: '👑 Royal Golden Arch (शाही गोल्डन पोस्टर)',
    election_type: 'panchayat',
    category: 'poster',
    format_name: 'A4 Grand Poster',
    format_dims: '600 × 848 px',
    thumbnail_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300&h=424&fit=crop',
    is_active: true,
    display_order: 5,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    layout_json: {
      bg_color: '#0f172a',
      width: 600,
      height: 848,
      elements: [
        // Royal Arch Decorative Frame
        { type: 'shape', x: 15, y: 15, width: 570, height: 818, color: '#1e293b', border_width: 3, border_color: '#f59e0b', border_radius: 20, z_index: 1 },
        
        // Header
        { type: 'shape', x: 30, y: 30, width: 540, height: 60, color: '#0f172a', border_width: 2, border_color: '#f59e0b', border_radius: 12, z_index: 2 },
        { type: 'text', x: 40, y: 35, width: 520, height: 22, value: '॥ जन सेवा ही हमारा संकल्प ॥', font_size: 13, font_weight: 'bold', color: '#fef08a', text_align: 'center', z_index: 3 },
        { type: 'text', x: 40, y: 58, width: 520, height: 26, placeholder: '{{headline}}', font_size: 18, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 },

        // Candidate Photo Large Centered
        { type: 'photo', x: 175, y: 100, width: 250, height: 250, placeholder: 'candidate_photo', border_width: 6, border_color: '#f59e0b', z_index: 3 },

        // Ballot Tag
        { type: 'shape', x: 235, y: 360, width: 130, height: 28, color: '#dc2626', border_radius: 6, z_index: 4 },
        { type: 'text', x: 235, y: 360, width: 130, height: 28, placeholder: 'क्रम सं. {{ballot_no}}', font_size: 13, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 5 },

        // Candidate Name & Title
        { type: 'text', x: 30, y: 398, width: 540, height: 48, placeholder: '{{candidate_name}}', font_size: 26, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 },
        { type: 'text', x: 30, y: 450, width: 540, height: 28, placeholder: '{{position}}', font_size: 18, font_weight: 'bold', color: '#fbbf24', text_align: 'center', z_index: 3 },
        { type: 'text', x: 30, y: 480, width: 540, height: 24, placeholder: '{{constituency}}', font_size: 15, color: '#cbd5e1', text_align: 'center', z_index: 3 },

        // Symbol Box
        { type: 'shape', x: 230, y: 512, width: 140, height: 130, color: '#ffffff', border_width: 3, border_color: '#f59e0b', border_radius: 16, z_index: 2 },
        { type: 'symbol', x: 230, y: 512, width: 140, height: 130, placeholder: '{{symbol}}', z_index: 3 },

        // Slogan
        { type: 'text', x: 40, y: 655, width: 520, height: 45, placeholder: '"{{slogan}}"', font_size: 15, font_weight: 'bold', color: '#fef08a', text_align: 'center', z_index: 3 },

        // Voting Date
        { type: 'text', x: 40, y: 710, width: 520, height: 25, placeholder: '{{voting_date}}', font_size: 14, color: '#94a3b8', text_align: 'center', z_index: 3 },

        // Footer Gold Bar
        { type: 'shape', x: 25, y: 750, width: 550, height: 68, color: '#f59e0b', border_radius: 12, z_index: 2 },
        { type: 'text', x: 35, y: 755, width: 530, height: 58, placeholder: 'चुनाव चिन्ह "{{symbol_name}}" के सामने वाला बटन दबाएं', font_size: 16, font_weight: 'bold', color: '#0f172a', text_align: 'center', z_index: 3 }
      ]
    }
  },
  {
    id: 'template-poster-centerpiece',
    organization_id: null,
    name: '🏛️ Grand Centerpiece (भव्य केंद्रीय पोस्टर)',
    election_type: 'panchayat',
    category: 'poster',
    format_name: 'A4 Centerpiece',
    format_dims: '600 × 848 px',
    thumbnail_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=424&fit=crop',
    is_active: true,
    display_order: 6,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    layout_json: {
      bg_color: '#fffbeb',
      width: 600,
      height: 848,
      elements: [
        // Top Header
        { type: 'shape', x: 0, y: 0, width: 600, height: 80, color: '#b45309', z_index: 1 },
        { type: 'text', x: 20, y: 15, width: 560, height: 50, placeholder: '{{headline}}', font_size: 24, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 },

        // Grand Center Photo
        { type: 'photo', x: 160, y: 95, width: 280, height: 280, placeholder: 'candidate_photo', border_width: 6, border_color: '#d97706', z_index: 2 },

        // Candidate Name & Title
        { type: 'text', x: 20, y: 385, width: 560, height: 48, placeholder: '{{candidate_name}}', font_size: 28, font_weight: 'bold', color: '#1c1917', text_align: 'center', z_index: 3 },
        { type: 'text', x: 20, y: 436, width: 560, height: 30, placeholder: '{{position}} • {{constituency}}', font_size: 18, font_weight: 'bold', color: '#b45309', text_align: 'center', z_index: 3 },

        // Slogan Box
        { type: 'shape', x: 30, y: 475, width: 540, height: 55, color: '#fef3c7', border_width: 2, border_color: '#f59e0b', border_radius: 14, z_index: 2 },
        { type: 'text', x: 40, y: 478, width: 520, height: 48, placeholder: '"{{slogan}}"', font_size: 15, font_weight: 'bold', color: '#78350f', text_align: 'center', z_index: 3 },

        // Symbol Box Left
        { type: 'shape', x: 50, y: 545, width: 160, height: 140, color: '#ffffff', border_width: 3, border_color: '#d97706', border_radius: 16, z_index: 2 },
        { type: 'symbol', x: 50, y: 545, width: 160, height: 140, placeholder: '{{symbol}}', z_index: 3 },

        // Ballot Tag Left
        { type: 'shape', x: 65, y: 535, width: 130, height: 24, color: '#dc2626', border_radius: 6, z_index: 4 },
        { type: 'text', x: 65, y: 535, width: 130, height: 24, placeholder: 'क्रम सं. {{ballot_no}}', font_size: 11, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 5 },

        // Right Voting Info Card
        { type: 'shape', x: 230, y: 545, width: 320, height: 140, color: '#ffffff', border_width: 2, border_color: '#fed7aa', border_radius: 16, z_index: 2 },
        { type: 'text', x: 245, y: 555, width: 290, height: 35, placeholder: 'चुनाव चिन्ह: {{symbol_name}}', font_size: 17, font_weight: 'bold', color: '#9a3412', text_align: 'left', z_index: 3 },
        { type: 'text', x: 245, y: 595, width: 290, height: 75, placeholder: '{{voting_date}}\nभारी मतों से विजयी बनाएं!', font_size: 14, font_weight: 'bold', color: '#44403c', text_align: 'left', z_index: 3 },

        // Bottom Strip
        { type: 'shape', x: 0, y: 735, width: 600, height: 113, color: '#1c1917', z_index: 1 },
        { type: 'text', x: 20, y: 745, width: 560, height: 85, placeholder: 'ईमानदार, कर्मठ एवं विकासशील प्रत्याशी को अपना अमूल्य मत देकर सफल बनाएं!', font_size: 16, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 }
      ]
    }
  },
  {
    id: 'template-poster-symbol-power',
    organization_id: null,
    name: '🚜 Symbol Power Poster (विशाल चुनाव चिन्ह)',
    election_type: 'panchayat',
    category: 'poster',
    format_name: 'A4 Symbol Focus',
    format_dims: '600 × 848 px',
    thumbnail_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&h=424&fit=crop',
    is_active: true,
    display_order: 7,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    layout_json: {
      bg_color: '#f8fafc',
      width: 600,
      height: 848,
      elements: [
        // Top Header
        { type: 'shape', x: 0, y: 0, width: 600, height: 90, color: '#ea580c', z_index: 1 },
        { type: 'text', x: 20, y: 12, width: 560, height: 28, value: '॥ प्रगति • सेवा • समर्पण ॥', font_size: 15, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 },
        { type: 'text', x: 20, y: 42, width: 560, height: 40, placeholder: '{{headline}}', font_size: 22, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 },

        // Left Candidate Photo
        { type: 'photo', x: 35, y: 110, width: 220, height: 220, placeholder: 'candidate_photo', border_width: 5, border_color: '#ea580c', z_index: 2 },

        // Right Giant Symbol Card
        { type: 'shape', x: 285, y: 110, width: 280, height: 220, color: '#ffffff', border_width: 4, border_color: '#ea580c', border_radius: 20, z_index: 2 },
        { type: 'symbol', x: 285, y: 110, width: 280, height: 165, placeholder: '{{symbol}}', font_size: 85, z_index: 3 },
        { type: 'text', x: 295, y: 280, width: 260, height: 38, placeholder: 'चिन्ह: {{symbol_name}}', font_size: 16, font_weight: 'bold', color: '#ea580c', text_align: 'center', z_index: 4 },

        // Ballot Tag Top Right
        { type: 'shape', x: 360, y: 95, width: 130, height: 26, color: '#dc2626', border_radius: 6, z_index: 4 },
        { type: 'text', x: 360, y: 95, width: 130, height: 26, placeholder: 'क्रम सं. {{ballot_no}}', font_size: 12, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 5 },

        // Candidate Name & Post
        { type: 'text', x: 20, y: 345, width: 560, height: 48, placeholder: '{{candidate_name}}', font_size: 28, font_weight: 'bold', color: '#0f172a', text_align: 'center', z_index: 3 },
        { type: 'text', x: 20, y: 398, width: 560, height: 32, placeholder: '{{position}} • {{constituency}}', font_size: 18, font_weight: 'bold', color: '#475569', text_align: 'center', z_index: 3 },

        // Slogan Box
        { type: 'shape', x: 25, y: 440, width: 550, height: 60, color: '#ffedd5', border_width: 2, border_color: '#fdba74', border_radius: 12, z_index: 2 },
        { type: 'text', x: 35, y: 445, width: 530, height: 50, placeholder: '"{{slogan}}"', font_size: 16, font_weight: 'bold', color: '#c2410c', text_align: 'center', z_index: 3 },

        // Voting Date Strip
        { type: 'shape', x: 25, y: 515, width: 550, height: 40, color: '#f1f5f9', border_radius: 10, z_index: 2 },
        { type: 'text', x: 35, y: 520, width: 530, height: 30, placeholder: '{{voting_date}}', font_size: 14, font_weight: 'bold', color: '#334155', text_align: 'center', z_index: 3 },

        // Bottom Callout Box
        { type: 'shape', x: 15, y: 580, width: 570, height: 245, color: '#15803d', border_radius: 16, z_index: 2 },
        { type: 'text', x: 30, y: 595, width: 540, height: 35, value: 'मतदान कैसे करें?', font_size: 20, font_weight: 'bold', color: '#fef08a', text_align: 'center', z_index: 3 },
        { type: 'text', x: 30, y: 640, width: 540, height: 165, placeholder: 'ईवीएम / मतपत्र में क्रम संख्या {{ballot_no}} पर चुनाव चिन्ह "{{symbol_name}}" के सामने वाला बटन दबाकर भारी मतों से विजयी बनाएं!', font_size: 17, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 }
      ]
    }
  },
  {
    id: 'template-banner-split-power',
    organization_id: null,
    name: '⚡ Split Power Banner (हाई-कंट्रास्ट बैनर)',
    election_type: 'panchayat',
    category: 'banner',
    format_name: 'Highway Flex 3×6',
    format_dims: '1200 × 600 px',
    thumbnail_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=300&h=150&fit=crop',
    is_active: true,
    display_order: 8,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    layout_json: {
      bg_color: '#1e1b4b',
      width: 1200,
      height: 600,
      elements: [
        // Left Side Shape
        { type: 'shape', x: 0, y: 0, width: 460, height: 600, color: '#312e81', z_index: 1 },
        { type: 'photo', x: 40, y: 100, width: 380, height: 380, placeholder: 'candidate_photo', border_width: 6, border_color: '#f59e0b', z_index: 2 },

        // Right Side Content
        { type: 'text', x: 480, y: 25, width: 680, height: 35, placeholder: '{{headline}}', font_size: 22, font_weight: 'bold', color: '#fde047', text_align: 'left', z_index: 3 },
        { type: 'text', x: 480, y: 65, width: 680, height: 60, placeholder: '{{candidate_name}}', font_size: 34, font_weight: 'bold', color: '#ffffff', text_align: 'left', z_index: 3 },
        { type: 'text', x: 480, y: 130, width: 680, height: 40, placeholder: '{{position}} • {{constituency}}', font_size: 19, font_weight: 'bold', color: '#93c5fd', text_align: 'left', z_index: 3 },

        // Symbol Card
        { type: 'shape', x: 480, y: 190, width: 140, height: 140, color: '#ffffff', border_width: 3, border_color: '#f59e0b', border_radius: 16, z_index: 2 },
        { type: 'symbol', x: 480, y: 190, width: 140, height: 140, placeholder: '{{symbol}}', z_index: 3 },

        // Ballot Tag
        { type: 'shape', x: 490, y: 175, width: 120, height: 26, color: '#dc2626', border_radius: 6, z_index: 4 },
        { type: 'text', x: 490, y: 175, width: 120, height: 26, placeholder: 'क्रम सं. {{ballot_no}}', font_size: 13, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 5 },

        // Slogan Right
        { type: 'text', x: 645, y: 200, width: 515, height: 110, placeholder: '"{{slogan}}"', font_size: 21, font_weight: 'bold', color: '#fde047', text_align: 'left', z_index: 3 },

        // Bottom Action Box
        { type: 'shape', x: 470, y: 380, width: 700, height: 170, color: '#f59e0b', border_radius: 16, z_index: 2 },
        { type: 'text', x: 490, y: 395, width: 660, height: 140, placeholder: '{{voting_date}}\nचुनाव चिन्ह "{{symbol_name}}" पर मोहर लगाकर विजयी बनाएं!', font_size: 20, font_weight: 'bold', color: '#0f172a', text_align: 'center', z_index: 3 }
      ]
    }
  },
  {
    id: 'template-banner-golden-tri',
    organization_id: null,
    name: '🚩 Golden Heritage Hoarding (विशाल होर्डिंग)',
    election_type: 'panchayat',
    category: 'banner',
    format_name: 'Heritage Hoarding',
    format_dims: '1200 × 600 px',
    thumbnail_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&h=150&fit=crop',
    is_active: true,
    display_order: 9,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    layout_json: {
      bg_color: '#ffffff',
      width: 1200,
      height: 600,
      elements: [
        // Top Saffron Banner
        { type: 'shape', x: 0, y: 0, width: 1200, height: 80, color: '#ff9933', z_index: 1 },
        { type: 'text', x: 40, y: 15, width: 1120, height: 50, placeholder: '॥ जय जवान • जय किसान ॥ • {{headline}}', font_size: 24, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 },

        // Left Candidate Photo
        { type: 'photo', x: 50, y: 115, width: 340, height: 340, placeholder: 'candidate_photo', border_width: 6, border_color: '#ff9933', z_index: 2 },

        // Center Details
        { type: 'text', x: 420, y: 105, width: 480, height: 60, placeholder: '{{candidate_name}}', font_size: 34, font_weight: 'bold', color: '#0f172a', text_align: 'left', z_index: 3 },
        { type: 'text', x: 420, y: 170, width: 480, height: 32, placeholder: '{{position}}', font_size: 20, font_weight: 'bold', color: '#334155', text_align: 'left', z_index: 3 },
        { type: 'text', x: 420, y: 205, width: 480, height: 30, placeholder: '{{constituency}}', font_size: 17, color: '#0284c7', text_align: 'left', z_index: 3 },
        
        // Slogan Box Center
        { type: 'shape', x: 420, y: 250, width: 480, height: 75, color: '#fef3c7', border_width: 2, border_color: '#f59e0b', border_radius: 12, z_index: 2 },
        { type: 'text', x: 435, y: 255, width: 450, height: 65, placeholder: '"{{slogan}}"', font_size: 18, font_weight: 'bold', color: '#92400e', text_align: 'center', z_index: 3 },

        // Date Center
        { type: 'text', x: 420, y: 345, width: 480, height: 32, placeholder: '{{voting_date}}', font_size: 16, font_weight: 'bold', color: '#475569', text_align: 'left', z_index: 3 },

        // Right Symbol Card
        { type: 'shape', x: 930, y: 110, width: 230, height: 260, color: '#ffffff', border_width: 4, border_color: '#138808', border_radius: 20, z_index: 2 },
        { type: 'symbol', x: 930, y: 115, width: 230, height: 180, placeholder: '{{symbol}}', font_size: 85, z_index: 3 },
        { type: 'text', x: 940, y: 305, width: 210, height: 50, placeholder: 'चिन्ह: {{symbol_name}}', font_size: 18, font_weight: 'bold', color: '#138808', text_align: 'center', z_index: 3 },

        // Ballot Tag Right
        { type: 'shape', x: 975, y: 95, width: 140, height: 30, color: '#dc2626', border_radius: 6, z_index: 4 },
        { type: 'text', x: 975, y: 95, width: 140, height: 30, placeholder: 'क्रम सं. {{ballot_no}}', font_size: 14, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 5 },

        // Bottom Green Bar
        { type: 'shape', x: 0, y: 495, width: 1200, height: 105, color: '#138808', z_index: 1 },
        { type: 'text', x: 30, y: 505, width: 1140, height: 85, placeholder: 'चुनाव चिन्ह "{{symbol_name}}" के सामने वाला बटन दबाकर भारी मतों से विजयी बनाएं!', font_size: 22, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 }
      ]
    }
  },
  {
    id: 'template-social-square-post',
    organization_id: null,
    name: '🖼️ Social Square Post 1:1 (फेसबुक / व्हाट्सएप पोस्ट)',
    election_type: 'panchayat',
    category: 'social',
    format_name: 'Square 1:1',
    format_dims: '720 × 720 px',
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop',
    is_active: true,
    display_order: 10,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    layout_json: {
      bg_color: '#0f172a',
      width: 720,
      height: 720,
      elements: [
        // Top Header
        { type: 'shape', x: 30, y: 25, width: 660, height: 50, color: '#1e293b', border_radius: 12, z_index: 2 },
        { type: 'text', x: 40, y: 32, width: 640, height: 35, placeholder: '॥ {{headline}} ॥', font_size: 20, font_weight: 'bold', color: '#38bdf8', text_align: 'center', z_index: 3 },

        // Left Candidate Photo
        { type: 'photo', x: 45, y: 95, width: 260, height: 260, placeholder: 'candidate_photo', border_width: 6, border_color: '#f59e0b', z_index: 2 },

        // Right Symbol Card
        { type: 'shape', x: 395, y: 95, width: 280, height: 260, color: '#ffffff', border_width: 4, border_color: '#f59e0b', border_radius: 20, z_index: 2 },
        { type: 'symbol', x: 395, y: 95, width: 280, height: 195, placeholder: '{{symbol}}', font_size: 90, z_index: 3 },
        { type: 'text', x: 405, y: 295, width: 260, height: 45, placeholder: '{{symbol_name}}', font_size: 18, font_weight: 'bold', color: '#b45309', text_align: 'center', z_index: 3 },

        // Ballot Tag Right
        { type: 'shape', x: 465, y: 80, width: 140, height: 28, color: '#dc2626', border_radius: 6, z_index: 4 },
        { type: 'text', x: 465, y: 80, width: 140, height: 28, placeholder: 'क्रम सं. {{ballot_no}}', font_size: 13, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 5 },

        // Candidate Name & Post
        { type: 'text', x: 30, y: 375, width: 660, height: 50, placeholder: '{{candidate_name}}', font_size: 28, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 },
        { type: 'text', x: 30, y: 430, width: 660, height: 32, placeholder: '{{position}} • {{constituency}}', font_size: 18, font_weight: 'bold', color: '#94a3b8', text_align: 'center', z_index: 3 },

        // Slogan Box
        { type: 'shape', x: 40, y: 475, width: 640, height: 65, color: '#1e293b', border_width: 2, border_color: '#f59e0b', border_radius: 14, z_index: 2 },
        { type: 'text', x: 50, y: 480, width: 620, height: 55, placeholder: '"{{slogan}}"', font_size: 17, font_weight: 'bold', color: '#fde047', text_align: 'center', z_index: 3 },

        // Bottom Action Box
        { type: 'shape', x: 30, y: 560, width: 660, height: 135, color: '#f59e0b', border_radius: 16, z_index: 2 },
        { type: 'text', x: 45, y: 575, width: 630, height: 105, placeholder: 'मतदान: {{voting_date}}\nचुनाव चिन्ह "{{symbol_name}}" के सामने वाला बटन दबाएं!', font_size: 18, font_weight: 'bold', color: '#0f172a', text_align: 'center', z_index: 3 }
      ]
    }
  },
  {
    id: 'template-social-modern-story',
    organization_id: null,
    name: '🌟 Emerald Power Story 9:16 (ग्रीन सोशल स्टोरी)',
    election_type: 'panchayat',
    category: 'social',
    format_name: 'Emerald Story 9:16',
    format_dims: '540 × 960 px',
    thumbnail_url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=270&h=480&fit=crop',
    is_active: true,
    display_order: 11,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    layout_json: {
      bg_color: '#042f2e',
      width: 540,
      height: 960,
      elements: [
        // Top Ribbon
        { type: 'shape', x: 0, y: 0, width: 540, height: 75, color: '#0d9488', z_index: 1 },
        { type: 'text', x: 20, y: 20, width: 500, height: 40, placeholder: '॥ {{headline}} ॥', font_size: 20, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 },

        // Candidate Photo
        { type: 'photo', x: 120, y: 100, width: 300, height: 300, placeholder: 'candidate_photo', border_width: 6, border_color: '#2dd4bf', z_index: 2 },

        // Name & Post
        { type: 'text', x: 20, y: 415, width: 500, height: 50, placeholder: '{{candidate_name}}', font_size: 26, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 },
        { type: 'text', x: 20, y: 470, width: 500, height: 30, placeholder: '{{position}}', font_size: 18, font_weight: 'bold', color: '#5eead4', text_align: 'center', z_index: 3 },
        { type: 'text', x: 20, y: 505, width: 500, height: 26, placeholder: '{{constituency}}', font_size: 15, color: '#ccfbf1', text_align: 'center', z_index: 3 },

        // Symbol Box
        { type: 'shape', x: 195, y: 550, width: 150, height: 150, color: '#ffffff', border_width: 4, border_color: '#2dd4bf', border_radius: 20, z_index: 2 },
        { type: 'symbol', x: 195, y: 550, width: 150, height: 150, placeholder: '{{symbol}}', z_index: 3 },

        // Ballot Tag
        { type: 'shape', x: 205, y: 535, width: 130, height: 26, color: '#dc2626', border_radius: 6, z_index: 4 },
        { type: 'text', x: 205, y: 535, width: 130, height: 26, placeholder: 'क्रम सं. {{ballot_no}}', font_size: 12, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 5 },

        { type: 'text', x: 170, y: 710, width: 200, height: 30, placeholder: 'चिन्ह: {{symbol_name}}', font_size: 16, font_weight: 'bold', color: '#5eead4', text_align: 'center', z_index: 3 },

        // Slogan Box
        { type: 'shape', x: 30, y: 755, width: 480, height: 60, color: '#134e4a', border_radius: 12, z_index: 2 },
        { type: 'text', x: 40, y: 760, width: 460, height: 50, placeholder: '"{{slogan}}"', font_size: 16, font_weight: 'bold', color: '#fef08a', text_align: 'center', z_index: 3 },

        // Footer Action
        { type: 'shape', x: 20, y: 840, width: 500, height: 95, color: '#0d9488', border_radius: 14, z_index: 2 },
        { type: 'text', x: 30, y: 850, width: 480, height: 75, placeholder: '{{voting_date}}\nभारी मतों से विजयी बनाएं!', font_size: 16, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 }
      ]
    }
  },
  {
    id: 'template-pamphlet-handbill-duo',
    organization_id: null,
    name: '📄 Campaign Manifesto Handbill A5 (घोषणा पत्र हैंडबिल)',
    election_type: 'panchayat',
    category: 'pamphlet',
    format_name: 'A5 Manifesto Handbill',
    format_dims: '600 × 848 px',
    thumbnail_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=424&fit=crop',
    is_active: true,
    display_order: 12,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    layout_json: {
      bg_color: '#f8fafc',
      width: 600,
      height: 848,
      elements: [
        // Top Header
        { type: 'shape', x: 0, y: 0, width: 600, height: 90, color: '#1e3a8a', z_index: 1 },
        { type: 'text', x: 20, y: 15, width: 560, height: 35, placeholder: '{{headline}}', font_size: 24, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 },
        { type: 'text', x: 20, y: 52, width: 560, height: 25, value: 'जनता की आवाज • विकास का संकल्प • चुनाव घोषणा पत्र', font_size: 14, color: '#93c5fd', text_align: 'center', z_index: 3 },

        // Left Candidate Photo
        { type: 'photo', x: 40, y: 110, width: 220, height: 220, placeholder: 'candidate_photo', border_width: 4, border_color: '#1e3a8a', z_index: 2 },

        // Right Symbol Card
        { type: 'shape', x: 340, y: 110, width: 220, height: 220, color: '#ffffff', border_width: 3, border_color: '#1e3a8a', border_radius: 16, z_index: 2 },
        { type: 'symbol', x: 340, y: 110, width: 220, height: 175, placeholder: '{{symbol}}', font_size: 80, z_index: 3 },
        { type: 'text', x: 350, y: 285, width: 200, height: 38, placeholder: '{{symbol_name}}', font_size: 16, font_weight: 'bold', color: '#1e3a8a', text_align: 'center', z_index: 3 },

        // Ballot Tag
        { type: 'shape', x: 385, y: 95, width: 130, height: 26, color: '#dc2626', border_radius: 6, z_index: 4 },
        { type: 'text', x: 385, y: 95, width: 130, height: 26, placeholder: 'क्रम सं. {{ballot_no}}', font_size: 12, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 5 },

        // Candidate Name & Title
        { type: 'text', x: 20, y: 340, width: 560, height: 45, placeholder: '{{candidate_name}}', font_size: 26, font_weight: 'bold', color: '#0f172a', text_align: 'center', z_index: 3 },
        { type: 'text', x: 20, y: 390, width: 560, height: 28, placeholder: '{{position}} • {{constituency}}', font_size: 17, font_weight: 'bold', color: '#2563eb', text_align: 'center', z_index: 3 },

        // Slogan Ribbon
        { type: 'shape', x: 30, y: 430, width: 540, height: 50, color: '#dbeafe', border_width: 1, border_color: '#93c5fd', border_radius: 10, z_index: 2 },
        { type: 'text', x: 40, y: 435, width: 520, height: 40, placeholder: '"{{slogan}}"', font_size: 15, font_weight: 'bold', color: '#1e40af', text_align: 'center', z_index: 3 },

        // Manifesto Box
        { type: 'shape', x: 30, y: 495, width: 540, height: 185, color: '#ffffff', border_width: 1, border_color: '#cbd5e1', border_radius: 12, z_index: 2 },
        { type: 'text', x: 50, y: 510, width: 500, height: 35, value: '✓ हर घर शुद्ध पेयजल एवं पक्की गलियों का निर्माण', font_size: 15, font_weight: 'bold', color: '#334155', text_align: 'left', z_index: 3 },
        { type: 'text', x: 50, y: 550, width: 500, height: 35, value: '✓ किसानों एवं युवाओं के लिए सरकारी योजनाओं का लाभ', font_size: 15, font_weight: 'bold', color: '#334155', text_align: 'left', z_index: 3 },
        { type: 'text', x: 50, y: 590, width: 500, height: 35, value: '✓ पारदर्शी ग्राम पंचायत प्रशासन एवं 24x7 जनसुनवाई', font_size: 15, font_weight: 'bold', color: '#334155', text_align: 'left', z_index: 3 },
        { type: 'text', x: 50, y: 635, width: 500, height: 28, placeholder: 'मतदान दिनांक: {{voting_date}}', font_size: 14, font_weight: 'bold', color: '#2563eb', text_align: 'left', z_index: 3 },

        // Bottom Footer Bar
        { type: 'shape', x: 20, y: 700, width: 560, height: 130, color: '#1e3a8a', border_radius: 14, z_index: 2 },
        { type: 'text', x: 30, y: 710, width: 540, height: 110, placeholder: 'कृपया अपना बहुमूल्य वोट चुनाव चिन्ह "{{symbol_name}}" के सामने वाला बटन दबाकर भारी मतों से विजयी बनाएं!', font_size: 16, font_weight: 'bold', color: '#ffffff', text_align: 'center', z_index: 3 }
      ]
    }
  }
];

export { getDefaultTemplateForCandidate } from './templateSelector';

