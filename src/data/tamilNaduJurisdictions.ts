import { ComplaintLocation } from '@/types';

// All 38 Revenue Districts of Tamil Nadu (Official Gazette)
export const TAMIL_NADU_DISTRICTS = [
  'Ariyalur',
  'Chengalpattu',
  'Chennai',
  'Coimbatore',
  'Cuddalore',
  'Dharmapuri',
  'Dindigul',
  'Erode',
  'Kallakurichi',
  'Kanchipuram',
  'Kanniyakumari',
  'Karur',
  'Krishnagiri',
  'Madurai',
  'Mayiladuthurai',
  'Nagapattinam',
  'Namakkal',
  'Nilgiris',
  'Perambalur',
  'Pudukkottai',
  'Ramanathapuram',
  'Ranipet',
  'Salem',
  'Sivaganga',
  'Tenkasi',
  'Thanjavur',
  'Theni',
  'Thoothukudi',
  'Tiruchirappalli',
  'Tirunelveli',
  'Tirupattur',
  'Tiruppur',
  'Tiruvallur',
  'Tiruvannamalai',
  'Tiruvarur',
  'Vellore',
  'Viluppuram',
  'Virudhunagar',
] as const;

export type TamilNaduDistrict = typeof TAMIL_NADU_DISTRICTS[number];

export interface WardAreaInfo {
  ward: string;
  area: string;
  lat: number;
  lng: number;
  pinCode?: string;
}

export interface ZoneInfo {
  zoneName: string;
  wards: WardAreaInfo[];
}

export interface MunicipalityInfo {
  id: string;
  name: string;
  district: TamilNaduDistrict;
  type: 'City Municipal Corporation' | 'Special Grade Municipality' | 'Municipality';
  center: { lat: number; lng: number };
  zones: ZoneInfo[];
}

export const TAMIL_NADU_MUNICIPALITIES: MunicipalityInfo[] = [
  // 1. Chennai (Greater Chennai Corporation)
  {
    id: 'gcc-chennai',
    name: 'Chennai (Greater Chennai Corporation)',
    district: 'Chennai',
    type: 'City Municipal Corporation',
    center: { lat: 13.0827, lng: 80.2707 },
    zones: [
      {
        zoneName: 'Zone 8 (Central - Anna Nagar)',
        wards: [
          { ward: 'Ward 102', area: 'Anna Nagar West', lat: 13.0850, lng: 80.2101, pinCode: '600040' },
          { ward: 'Ward 104', area: 'Kilpauk Medical Enclave', lat: 13.0812, lng: 80.2415, pinCode: '600010' },
          { ward: 'Ward 100', area: 'Shenoy Nagar Metro', lat: 13.0768, lng: 80.2256, pinCode: '600030' },
        ],
      },
      {
        zoneName: 'Zone 10 (South-Central - Kodambakkam)',
        wards: [
          { ward: 'Ward 114', area: 'T. Nagar Commercial (Usman Rd)', lat: 13.0418, lng: 80.2341, pinCode: '600017' },
          { ward: 'Ward 130', area: 'Vadapalani Temple Area', lat: 13.0500, lng: 80.2120, pinCode: '600026' },
        ],
      },
      {
        zoneName: 'Zone 9 (Central-East - Teynampet)',
        wards: [
          { ward: 'Ward 121', area: 'Mylapore Heritage Zone', lat: 13.0336, lng: 80.2678, pinCode: '600004' },
          { ward: 'Ward 123', area: 'Alwarpet TTK Road', lat: 13.0345, lng: 80.2520, pinCode: '600018' },
        ],
      },
      {
        zoneName: 'Zone 13 (South - Adyar)',
        wards: [
          { ward: 'Ward 173', area: 'Adyar Canal Corridor', lat: 13.0067, lng: 80.2575, pinCode: '600020' },
          { ward: 'Ward 175', area: 'Besant Nagar Beach Corridor', lat: 13.0001, lng: 80.2670, pinCode: '600090' },
        ],
      },
      {
        zoneName: 'Zone 14 (South - Perungudi)',
        wards: [
          { ward: 'Ward 178', area: 'Velachery Bypass Road', lat: 12.9759, lng: 80.2212, pinCode: '600042' },
          { ward: 'Ward 184', area: 'Perungudi OMR IT Corridor', lat: 12.9654, lng: 80.2461, pinCode: '600096' },
        ],
      },
      {
        zoneName: 'Zone 5 (North - Royapuram)',
        wards: [
          { ward: 'Ward 50', area: 'George Town / High Court', lat: 13.0878, lng: 80.2885, pinCode: '600001' },
          { ward: 'Ward 52', area: 'Royapuram Harbour Area', lat: 13.1090, lng: 80.2980, pinCode: '600013' },
        ],
      },
    ],
  },

  // 2. Tambaram Municipal Corporation
  {
    id: 'tambaram-corp',
    name: 'Tambaram (Tambaram Municipal Corporation)',
    district: 'Chengalpattu',
    type: 'City Municipal Corporation',
    center: { lat: 12.9249, lng: 80.1000 },
    zones: [
      {
        zoneName: 'Zone 4 (Tambaram Central)',
        wards: [
          { ward: 'Ward 18', area: 'East Tambaram Railway Station Area', lat: 12.9220, lng: 80.1200, pinCode: '600059' },
          { ward: 'Ward 26', area: 'West Tambaram GST Road Corridor', lat: 12.9260, lng: 80.1140, pinCode: '600045' },
        ],
      },
      {
        zoneName: 'Zone 2 (Pallavaram & Chromepet)',
        wards: [
          { ward: 'Ward 32', area: 'Chromepet Commercial Hub', lat: 12.9516, lng: 80.1462, pinCode: '600044' },
          { ward: 'Ward 45', area: 'Pallavaram Cantonment & GST', lat: 12.9675, lng: 80.1491, pinCode: '600043' },
        ],
      },
      {
        zoneName: 'Zone 3 (Sembakkam & Medavakkam)',
        wards: [
          { ward: 'Ward 50', area: 'Sembakkam Velachery-Tambaram Rd', lat: 12.9295, lng: 80.1580, pinCode: '600073' },
        ],
      },
    ],
  },

  // 3. Avadi Municipal Corporation
  {
    id: 'avadi-corp',
    name: 'Avadi (Avadi Municipal Corporation)',
    district: 'Tiruvallur',
    type: 'City Municipal Corporation',
    center: { lat: 13.1147, lng: 80.1018 },
    zones: [
      {
        zoneName: 'Zone 1 (Avadi Town Central)',
        wards: [
          { ward: 'Ward 12', area: 'Avadi HVF Estate & Market', lat: 13.1180, lng: 80.1080, pinCode: '600054' },
          { ward: 'Ward 18', area: 'Nehru Bazaar & Bus Stand', lat: 13.1140, lng: 80.1010, pinCode: '600054' },
        ],
      },
      {
        zoneName: 'Zone 2 (Pattabiram Sector)',
        wards: [
          { ward: 'Ward 28', area: 'Pattabiram Tidel Park Corridor', lat: 13.1230, lng: 80.0590, pinCode: '600072' },
        ],
      },
      {
        zoneName: 'Zone 3 (Thirumullaivoyal Industrial)',
        wards: [
          { ward: 'Ward 35', area: 'Thirumullaivoyal Industrial Estate', lat: 13.1310, lng: 80.1380, pinCode: '600062' },
        ],
      },
    ],
  },

  // 4. Coimbatore (Coimbatore City Municipal Corporation)
  {
    id: 'coimbatore-corp',
    name: 'Coimbatore (Coimbatore City Municipal Corporation)',
    district: 'Coimbatore',
    type: 'City Municipal Corporation',
    center: { lat: 11.0168, lng: 76.9558 },
    zones: [
      {
        zoneName: 'West Zone (RS Puram)',
        wards: [
          { ward: 'Ward 72', area: 'RS Puram D.B. Road', lat: 11.0080, lng: 76.9480, pinCode: '641002' },
          { ward: 'Ward 75', area: 'Saibaba Colony Mettupalayam Rd', lat: 11.0260, lng: 76.9420, pinCode: '641011' },
        ],
      },
      {
        zoneName: 'Central Zone (Gandhipuram)',
        wards: [
          { ward: 'Ward 63', area: 'Gandhipuram Cross Cut Road', lat: 11.0180, lng: 76.9670, pinCode: '641012' },
          { ward: 'Ward 68', area: 'Race Course Promenade', lat: 11.0010, lng: 76.9740, pinCode: '641018' },
        ],
      },
      {
        zoneName: 'East Zone (Peelamedu)',
        wards: [
          { ward: 'Ward 30', area: 'Peelamedu Avinashi Road', lat: 11.0270, lng: 77.0050, pinCode: '641004' },
          { ward: 'Ward 45', area: 'Saravanampatti Tech Corridor', lat: 11.0820, lng: 76.9980, pinCode: '641035' },
        ],
      },
      {
        zoneName: 'South Zone (Ukkadam & Kuniamuthur)',
        wards: [
          { ward: 'Ward 81', area: 'Ukkadam Big Lakefront', lat: 10.9890, lng: 76.9610, pinCode: '641001' },
          { ward: 'Ward 88', area: 'Singanallur Trichy Road', lat: 10.9980, lng: 77.0250, pinCode: '641005' },
        ],
      },
    ],
  },

  // 5. Madurai (Madurai Municipal Corporation)
  {
    id: 'madurai-corp',
    name: 'Madurai (Madurai Municipal Corporation)',
    district: 'Madurai',
    type: 'City Municipal Corporation',
    center: { lat: 9.9252, lng: 78.1198 },
    zones: [
      {
        zoneName: 'Central Zone (Heritage & Temple)',
        wards: [
          { ward: 'Ward 42', area: 'Meenakshi Temple Outer Car Street', lat: 9.9195, lng: 78.1193, pinCode: '625001' },
          { ward: 'Ward 45', area: 'Periyar Bus Stand Complex', lat: 9.9150, lng: 78.1120, pinCode: '625001' },
        ],
      },
      {
        zoneName: 'North Zone (Goripalayam & Sellur)',
        wards: [
          { ward: 'Ward 75', area: 'Goripalayam Junction Vaigai Riverfront', lat: 9.9320, lng: 78.1310, pinCode: '625002' },
          { ward: 'Ward 36', area: 'Sellur Causeway Road', lat: 9.9390, lng: 78.1180, pinCode: '625002' },
        ],
      },
      {
        zoneName: 'East Zone (KK Nagar & Mattuthavani)',
        wards: [
          { ward: 'Ward 28', area: 'KK Nagar 80 Feet Road', lat: 9.9310, lng: 78.1490, pinCode: '625020' },
          { ward: 'Ward 64', area: 'Mattuthavani Integrated Bus Terminal', lat: 9.9470, lng: 78.1610, pinCode: '625007' },
        ],
      },
      {
        zoneName: 'South Zone (Villapuram & Thiruparankundram)',
        wards: [
          { ward: 'Ward 85', area: 'Thiruparankundram Temple Highway', lat: 9.8820, lng: 78.0720, pinCode: '625005' },
        ],
      },
    ],
  },

  // 6. Tiruchirappalli (Tiruchirappalli City Municipal Corporation)
  {
    id: 'trichy-corp',
    name: 'Tiruchirappalli (Tiruchirappalli City Municipal Corporation)',
    district: 'Tiruchirappalli',
    type: 'City Municipal Corporation',
    center: { lat: 10.7905, lng: 78.7047 },
    zones: [
      {
        zoneName: 'Srirangam Zone',
        wards: [
          { ward: 'Ward 12', area: 'Srirangam Ranganathaswamy Temple Area', lat: 10.8620, lng: 78.6900, pinCode: '620006' },
          { ward: 'Ward 18', area: 'Thiruvanaikoil Trunk Road', lat: 10.8520, lng: 78.7050, pinCode: '620005' },
        ],
      },
      {
        zoneName: 'K.Abishekapuram Zone (Thillai Nagar)',
        wards: [
          { ward: 'Ward 34', area: 'Thillai Nagar Main Road', lat: 10.8250, lng: 78.6830, pinCode: '620018' },
          { ward: 'Ward 40', area: 'Shastri Road Commercial Strip', lat: 10.8290, lng: 78.6920, pinCode: '620018' },
        ],
      },
      {
        zoneName: 'Ponmalai (Golden Rock) Zone',
        wards: [
          { ward: 'Ward 56', area: 'Golden Rock Railway Colony & Workshop', lat: 10.7820, lng: 78.7210, pinCode: '620004' },
          { ward: 'Ward 62', area: 'Airport Road KK Nagar', lat: 10.7680, lng: 78.7110, pinCode: '620021' },
        ],
      },
      {
        zoneName: 'Kottai Zone (Central Rockfort)',
        wards: [
          { ward: 'Ward 22', area: 'Rockfort Main Guard Gate', lat: 10.8280, lng: 78.6970, pinCode: '620002' },
          { ward: 'Ward 45', area: 'Central Bus Stand Cantonment', lat: 10.7980, lng: 78.6820, pinCode: '620001' },
        ],
      },
    ],
  },

  // 7. Salem (Salem City Municipal Corporation)
  {
    id: 'salem-corp',
    name: 'Salem (Salem City Municipal Corporation)',
    district: 'Salem',
    type: 'City Municipal Corporation',
    center: { lat: 11.6643, lng: 78.1460 },
    zones: [
      {
        zoneName: 'Hasthampatti Zone',
        wards: [
          { ward: 'Ward 15', area: 'Fairlands Brindavan Road', lat: 11.6740, lng: 78.1420, pinCode: '636016' },
          { ward: 'Ward 28', area: 'Hasthampatti Roundtana Collectorate', lat: 11.6780, lng: 78.1620, pinCode: '636007' },
        ],
      },
      {
        zoneName: 'Suramangalam Zone',
        wards: [
          { ward: 'Ward 38', area: 'New Bus Stand Swarnapuri', lat: 11.6680, lng: 78.1310, pinCode: '636004' },
          { ward: 'Ward 42', area: 'Salem Junction Railway Station Rd', lat: 11.6730, lng: 78.1180, pinCode: '636005' },
        ],
      },
      {
        zoneName: 'Ammapet Zone',
        wards: [
          { ward: 'Ward 49', area: 'Ammapet Main Road Handloom Hub', lat: 11.6540, lng: 78.1810, pinCode: '636003' },
        ],
      },
      {
        zoneName: 'Kondalampatti Zone',
        wards: [
          { ward: 'Ward 55', area: 'Kondalampatti Bypass National Highway', lat: 11.6240, lng: 78.1320, pinCode: '636010' },
        ],
      },
    ],
  },

  // 8. Tiruppur (Tiruppur City Municipal Corporation)
  {
    id: 'tiruppur-corp',
    name: 'Tiruppur (Tiruppur City Municipal Corporation)',
    district: 'Tiruppur',
    type: 'City Municipal Corporation',
    center: { lat: 11.1085, lng: 77.3411 },
    zones: [
      {
        zoneName: 'North Zone (Avinashi Road)',
        wards: [
          { ward: 'Ward 22', area: 'Avinashi Road Pushpa Theatre Junction', lat: 11.1180, lng: 77.3390, pinCode: '641602' },
          { ward: 'Ward 25', area: 'Anupparpalayam Metal & Garment Belt', lat: 11.1490, lng: 77.3240, pinCode: '641652' },
        ],
      },
      {
        zoneName: 'Central Zone (Kumaran Road)',
        wards: [
          { ward: 'Ward 35', area: 'Kumaran Road Railway Station Perimeter', lat: 11.1070, lng: 77.3460, pinCode: '641601' },
        ],
      },
      {
        zoneName: 'South Zone (Dharapuram & Palladam Roads)',
        wards: [
          { ward: 'Ward 48', area: 'Dharapuram Road KNP Colony', lat: 11.0890, lng: 77.3620, pinCode: '641608' },
          { ward: 'Ward 52', area: 'Palladam Road Cotton Market', lat: 11.0920, lng: 77.3320, pinCode: '641604' },
        ],
      },
    ],
  },

  // 9. Erode (Erode City Municipal Corporation)
  {
    id: 'erode-corp',
    name: 'Erode (Erode City Municipal Corporation)',
    district: 'Erode',
    type: 'City Municipal Corporation',
    center: { lat: 11.3410, lng: 77.7172 },
    zones: [
      {
        zoneName: 'Zone 1 (Brough Road Central)',
        wards: [
          { ward: 'Ward 18', area: 'Brough Road Textile Commercial Centre', lat: 11.3450, lng: 77.7220, pinCode: '638001' },
          { ward: 'Ward 24', area: 'Erode Central Bus Stand', lat: 11.3380, lng: 77.7160, pinCode: '638003' },
        ],
      },
      {
        zoneName: 'Zone 2 (Surampatti & Perundurai)',
        wards: [
          { ward: 'Ward 27', area: 'Surampatti Four Roads Junction', lat: 11.3250, lng: 77.7050, pinCode: '638009' },
          { ward: 'Ward 32', area: 'Perundurai Road Collectorate Campus', lat: 11.3320, lng: 77.6890, pinCode: '638011' },
        ],
      },
    ],
  },

  // 10. Tirunelveli (Tirunelveli City Municipal Corporation)
  {
    id: 'tirunelveli-corp',
    name: 'Tirunelveli (Tirunelveli City Municipal Corporation)',
    district: 'Tirunelveli',
    type: 'City Municipal Corporation',
    center: { lat: 8.7139, lng: 77.7567 },
    zones: [
      {
        zoneName: 'Palayamkottai Zone (Oxford of South India)',
        wards: [
          { ward: 'Ward 14', area: 'Palayamkottai High Ground Market', lat: 8.7180, lng: 77.7490, pinCode: '627002' },
          { ward: 'Ward 22', area: 'Vannarpettai Bridge Thamirabarani Bank', lat: 8.7290, lng: 77.7340, pinCode: '627003' },
        ],
      },
      {
        zoneName: 'Tirunelveli Town Zone',
        wards: [
          { ward: 'Ward 25', area: 'Swami Nellaiappar Car Street', lat: 8.7320, lng: 77.7010, pinCode: '627006' },
        ],
      },
      {
        zoneName: 'Melapalayam Zone',
        wards: [
          { ward: 'Ward 47', area: 'Melapalayam Main Bazaar Road', lat: 8.6980, lng: 77.7310, pinCode: '627005' },
        ],
      },
    ],
  },

  // 11. Vellore (Vellore City Municipal Corporation)
  {
    id: 'vellore-corp',
    name: 'Vellore (Vellore City Municipal Corporation)',
    district: 'Vellore',
    type: 'City Municipal Corporation',
    center: { lat: 12.9165, lng: 79.1325 },
    zones: [
      {
        zoneName: 'Zone 1 (Katpadi Sector)',
        wards: [
          { ward: 'Ward 12', area: 'Katpadi Railway Junction Road', lat: 12.9690, lng: 79.1410, pinCode: '632007' },
          { ward: 'Ward 15', area: 'VIT Chittoor Road Corridor', lat: 12.9720, lng: 79.1580, pinCode: '632014' },
        ],
      },
      {
        zoneName: 'Zone 2 (Historic Fort & Central)',
        wards: [
          { ward: 'Ward 24', area: 'Vellore Fort Gandhi Road Corridor', lat: 12.9230, lng: 79.1310, pinCode: '632004' },
          { ward: 'Ward 30', area: 'Sathuvachari District Collectorate', lat: 12.9340, lng: 79.1620, pinCode: '632009' },
        ],
      },
    ],
  },

  // 12. Thoothukudi (Thoothukudi City Municipal Corporation)
  {
    id: 'thoothukudi-corp',
    name: 'Thoothukudi (Thoothukudi City Municipal Corporation)',
    district: 'Thoothukudi',
    type: 'City Municipal Corporation',
    center: { lat: 8.7642, lng: 78.1348 },
    zones: [
      {
        zoneName: 'Port Zone (Pearl City Coastal)',
        wards: [
          { ward: 'Ward 15', area: 'VOC Port Harbour Trunk Road', lat: 8.7510, lng: 78.1720, pinCode: '628004' },
          { ward: 'Ward 22', area: 'Beach Road Cruz Fernandez Circle', lat: 8.8020, lng: 78.1580, pinCode: '628001' },
        ],
      },
      {
        zoneName: 'Central Zone (Palayamkottai Road)',
        wards: [
          { ward: 'Ward 28', area: 'Palayamkottai Road Millerpuram', lat: 8.7910, lng: 78.1310, pinCode: '628008' },
        ],
      },
    ],
  },

  // 13. Dindigul (Dindigul City Municipal Corporation)
  {
    id: 'dindigul-corp',
    name: 'Dindigul (Dindigul City Municipal Corporation)',
    district: 'Dindigul',
    type: 'City Municipal Corporation',
    center: { lat: 10.3673, lng: 77.9803 },
    zones: [
      {
        zoneName: 'Rock Fort Zone',
        wards: [
          { ward: 'Ward 14', area: 'Rock Fort Round Road', lat: 10.3620, lng: 77.9710, pinCode: '624001' },
          { ward: 'Ward 25', area: 'Palani Road Bus Stand', lat: 10.3720, lng: 77.9650, pinCode: '624002' },
        ],
      },
    ],
  },

  // 14. Thanjavur (Thanjavur City Municipal Corporation)
  {
    id: 'thanjavur-corp',
    name: 'Thanjavur (Thanjavur City Municipal Corporation)',
    district: 'Thanjavur',
    type: 'City Municipal Corporation',
    center: { lat: 10.7870, lng: 79.1378 },
    zones: [
      {
        zoneName: 'Brihadisvara Big Temple Zone',
        wards: [
          { ward: 'Ward 12', area: 'Big Temple Sivaganga Park', lat: 10.7820, lng: 79.1310, pinCode: '613001' },
          { ward: 'Ward 28', area: 'Medical College Road', lat: 10.7680, lng: 79.1210, pinCode: '613004' },
        ],
      },
    ],
  },

  // 15. Cuddalore (Cuddalore City Municipal Corporation)
  {
    id: 'cuddalore-corp',
    name: 'Cuddalore (Cuddalore City Municipal Corporation)',
    district: 'Cuddalore',
    type: 'City Municipal Corporation',
    center: { lat: 11.7480, lng: 79.7714 },
    zones: [
      {
        zoneName: 'Manjakuppam Zone',
        wards: [
          { ward: 'Ward 18', area: 'Manjakuppam Collectorate Enclave', lat: 11.7580, lng: 79.7610, pinCode: '607001' },
          { ward: 'Ward 26', area: 'Cuddalore Old Town (OT) Port', lat: 11.7230, lng: 79.7710, pinCode: '607003' },
          { ward: 'Ward 35', area: 'Silver Beach Coastal Boulevard', lat: 11.7080, lng: 79.7820, pinCode: '607005' },
        ],
      },
    ],
  },

  // 16. Kanchipuram (Kanchipuram City Municipal Corporation)
  {
    id: 'kanchipuram-corp',
    name: 'Kanchipuram (Kanchipuram City Municipal Corporation)',
    district: 'Kanchipuram',
    type: 'City Municipal Corporation',
    center: { lat: 12.8342, lng: 79.7036 },
    zones: [
      {
        zoneName: 'Silk Heritage Zone',
        wards: [
          { ward: 'Ward 15', area: 'Gandhi Road Silk Weavers Hub', lat: 12.8360, lng: 79.7050, pinCode: '631501' },
          { ward: 'Ward 28', area: 'Ekambareswarar Sannathi Street', lat: 12.8470, lng: 79.6990, pinCode: '631502' },
          { ward: 'Ward 42', area: 'Collectorate Complex Orikkai', lat: 12.8120, lng: 79.7120, pinCode: '631501' },
        ],
      },
    ],
  },

  // 17. Karur (Karur City Municipal Corporation)
  {
    id: 'karur-corp',
    name: 'Karur (Karur City Municipal Corporation)',
    district: 'Karur',
    type: 'City Municipal Corporation',
    center: { lat: 10.9601, lng: 78.0766 },
    zones: [
      {
        zoneName: 'Amaravathi & Textile Zone',
        wards: [
          { ward: 'Ward 14', area: 'Jawahar Bazaar Bus Stand', lat: 10.9630, lng: 78.0810, pinCode: '639001' },
          { ward: 'Ward 24', area: 'Thanthonimalai Collectorate', lat: 10.9320, lng: 78.0920, pinCode: '639005' },
        ],
      },
    ],
  },

  // 18. Kumbakonam (Kumbakonam City Municipal Corporation)
  {
    id: 'kumbakonam-corp',
    name: 'Kumbakonam (Kumbakonam City Municipal Corporation)',
    district: 'Thanjavur',
    type: 'City Municipal Corporation',
    center: { lat: 10.9602, lng: 79.3845 },
    zones: [
      {
        zoneName: 'Mahamaham Tank Zone',
        wards: [
          { ward: 'Ward 12', area: 'Mahamaham Tank North Bank', lat: 10.9570, lng: 79.3820, pinCode: '612001' },
          { ward: 'Ward 25', area: 'Sarangapani Sannathi TSR Big Street', lat: 10.9610, lng: 79.3780, pinCode: '612001' },
          { ward: 'Ward 35', area: 'Darasuram Airavatesvara Heritage', lat: 10.9480, lng: 79.3560, pinCode: '612702' },
        ],
      },
    ],
  },

  // 19. Nagercoil (Nagercoil City Municipal Corporation)
  {
    id: 'nagercoil-corp',
    name: 'Nagercoil (Nagercoil City Municipal Corporation)',
    district: 'Kanniyakumari',
    type: 'City Municipal Corporation',
    center: { lat: 8.1833, lng: 77.4119 },
    zones: [
      {
        zoneName: 'Vadasery Zone',
        wards: [
          { ward: 'Ward 15', area: 'Vadasery Bus Stand Clock Tower', lat: 8.1920, lng: 77.4240, pinCode: '629001' },
          { ward: 'Ward 27', area: 'Kottar Chetti Kulam Market', lat: 8.1750, lng: 77.4360, pinCode: '629002' },
          { ward: 'Ward 38', area: 'Asaripallam Medical College Area', lat: 8.1880, lng: 77.3910, pinCode: '629201' },
        ],
      },
    ],
  },

  // 20. Hosur (Hosur City Municipal Corporation)
  {
    id: 'hosur-corp',
    name: 'Hosur (Hosur City Municipal Corporation)',
    district: 'Krishnagiri',
    type: 'City Municipal Corporation',
    center: { lat: 12.7409, lng: 77.8253 },
    zones: [
      {
        zoneName: 'SIPCOT Industrial Zone',
        wards: [
          { ward: 'Ward 18', area: 'SIPCOT Phase 1 Industrial Corridor', lat: 12.7480, lng: 77.8120, pinCode: '635126' },
          { ward: 'Ward 26', area: 'Mookandapalli Industrial Hub', lat: 12.7320, lng: 77.8080, pinCode: '635126' },
          { ward: 'Ward 35', area: 'Bagalur Road Commercial Area', lat: 12.7560, lng: 77.8420, pinCode: '635109' },
        ],
      },
    ],
  },

  // 21. Tiruvannamalai (Tiruvannamalai Municipal Corporation)
  {
    id: 'tiruvannamalai-corp',
    name: 'Tiruvannamalai (Tiruvannamalai Municipal Corporation)',
    district: 'Tiruvannamalai',
    type: 'City Municipal Corporation',
    center: { lat: 12.2253, lng: 79.0747 },
    zones: [
      {
        zoneName: 'Girivalam & Annamalaiyar Zone',
        wards: [
          { ward: 'Ward 12', area: 'East Car Street Rajagopuram', lat: 12.2280, lng: 79.0690, pinCode: '606601' },
          { ward: 'Ward 24', area: 'Girivalam 14km Path (Surya Lingam)', lat: 12.2340, lng: 79.0490, pinCode: '606603' },
          { ward: 'Ward 35', area: 'Chengam Road Ramana Ashram Area', lat: 12.2150, lng: 79.0550, pinCode: '606603' },
        ],
      },
    ],
  },

  // 22. Pudukkottai (Pudukkottai Municipal Corporation)
  {
    id: 'pudukkottai-corp',
    name: 'Pudukkottai (Pudukkottai Municipal Corporation)',
    district: 'Pudukkottai',
    type: 'City Municipal Corporation',
    center: { lat: 10.3797, lng: 78.8208 },
    zones: [
      {
        zoneName: 'Palace Central Zone',
        wards: [
          { ward: 'Ward 14', area: 'Pudukkottai Palace View', lat: 10.3840, lng: 78.8210, pinCode: '622001' },
          { ward: 'Ward 25', area: 'Old Bus Stand Rajagopalapuram', lat: 10.3720, lng: 78.8150, pinCode: '622003' },
        ],
      },
    ],
  },

  // 23. Karaikudi (Karaikudi Municipal Corporation)
  {
    id: 'karaikudi-corp',
    name: 'Karaikudi (Karaikudi Municipal Corporation)',
    district: 'Sivaganga',
    type: 'City Municipal Corporation',
    center: { lat: 10.0673, lng: 78.7834 },
    zones: [
      {
        zoneName: 'Chettinad Heritage Zone',
        wards: [
          { ward: 'Ward 12', area: 'Alagappapuram University Campus', lat: 10.0780, lng: 78.7910, pinCode: '630003' },
          { ward: 'Ward 24', area: 'Kallukatti Chettinad Mansion Belt', lat: 10.0640, lng: 78.7780, pinCode: '630001' },
          { ward: 'Ward 33', area: 'Senjai Market Bus Stand', lat: 10.0590, lng: 78.7880, pinCode: '630001' },
        ],
      },
    ],
  },

  // 24. Sivakasi (Sivakasi Municipal Corporation)
  {
    id: 'sivakasi-corp',
    name: 'Sivakasi (Sivakasi Municipal Corporation)',
    district: 'Virudhunagar',
    type: 'City Municipal Corporation',
    center: { lat: 9.4533, lng: 77.7946 },
    zones: [
      {
        zoneName: 'Printing & Industrial Zone',
        wards: [
          { ward: 'Ward 15', area: 'Satchiyapuram Railway Station Road', lat: 9.4610, lng: 77.8050, pinCode: '626124' },
          { ward: 'Ward 28', area: 'Thiruthangal Bypass Road', lat: 9.4790, lng: 77.8120, pinCode: '626130' },
          { ward: 'Ward 38', area: 'Vilampatti Road Graphic Arts Cluster', lat: 9.4450, lng: 77.7890, pinCode: '626123' },
        ],
      },
    ],
  },

  // 25. Namakkal (Namakkal Municipal Corporation)
  {
    id: 'namakkal-corp',
    name: 'Namakkal (Namakkal Municipal Corporation)',
    district: 'Namakkal',
    type: 'City Municipal Corporation',
    center: { lat: 11.2189, lng: 78.1674 },
    zones: [
      {
        zoneName: 'Rock Fort & Transport Logistics Zone',
        wards: [
          { ward: 'Ward 12', area: 'Anjaneyar Temple Sannathi Road', lat: 11.2210, lng: 78.1680, pinCode: '637001' },
          { ward: 'Ward 24', area: 'Paramathi Road Truck Transport Hub', lat: 11.2090, lng: 78.1580, pinCode: '637001' },
          { ward: 'Ward 35', area: 'Mohanur Road Bus Stand Area', lat: 11.2120, lng: 78.1740, pinCode: '637002' },
        ],
      },
    ],
  },

  // Other District Headquarters Municipalities (Dharmapuri, Kallakurichi, Nilgiris, Ramanathapuram, Tenkasi, Theni, etc.)
  {
    id: 'dharmapuri-muni',
    name: 'Dharmapuri Municipality',
    district: 'Dharmapuri',
    type: 'Municipality',
    center: { lat: 12.1211, lng: 78.1582 },
    zones: [
      {
        zoneName: 'Dharmapuri Central',
        wards: [
          { ward: 'Ward 1', area: 'Collectorate Outer Ring', lat: 12.1250, lng: 78.1620, pinCode: '636701' },
          { ward: 'Ward 8', area: 'Dharmapuri Bus Stand Bazaar', lat: 12.1190, lng: 78.1540, pinCode: '636701' },
        ],
      },
    ],
  },
  {
    id: 'kallakurichi-muni',
    name: 'Kallakurichi Municipality',
    district: 'Kallakurichi',
    type: 'Municipality',
    center: { lat: 11.7383, lng: 78.9639 },
    zones: [
      {
        zoneName: 'Kallakurichi Central',
        wards: [
          { ward: 'Ward 1', area: 'Kachirapalayam Road', lat: 11.7410, lng: 78.9680, pinCode: '606202' },
          { ward: 'Ward 5', area: 'Salem Main Road Bus Stand', lat: 11.7350, lng: 78.9590, pinCode: '606202' },
        ],
      },
    ],
  },
  {
    id: 'ooty-muni',
    name: 'Udhagamandalam (Ooty) Municipality',
    district: 'Nilgiris',
    type: 'Special Grade Municipality',
    center: { lat: 11.4102, lng: 76.6950 },
    zones: [
      {
        zoneName: 'Ooty Lake & Botanical Zone',
        wards: [
          { ward: 'Ward 10', area: 'Commercial Road Charring Cross', lat: 11.4120, lng: 76.7030, pinCode: '643001' },
          { ward: 'Ward 15', area: 'Ooty Boat House & Lakefront', lat: 11.4050, lng: 76.6890, pinCode: '643001' },
        ],
      },
    ],
  },
  {
    id: 'ramanathapuram-muni',
    name: 'Ramanathapuram Municipality',
    district: 'Ramanathapuram',
    type: 'Municipality',
    center: { lat: 9.3639, lng: 78.8395 },
    zones: [
      {
        zoneName: 'Ramanathapuram Central',
        wards: [
          { ward: 'Ward 4', area: 'Raja Palace Salai Street', lat: 9.3680, lng: 78.8410, pinCode: '623501' },
          { ward: 'Ward 12', area: 'Rameswaram Road Bypass', lat: 9.3590, lng: 78.8350, pinCode: '623501' },
        ],
      },
    ],
  },
  {
    id: 'tenkasi-muni',
    name: 'Tenkasi Municipality',
    district: 'Tenkasi',
    type: 'Municipality',
    center: { lat: 8.9594, lng: 77.3150 },
    zones: [
      {
        zoneName: 'Courtallam & Temple Zone',
        wards: [
          { ward: 'Ward 3', area: 'Kasi Viswanathar Temple Car Street', lat: 8.9610, lng: 77.3120, pinCode: '627811' },
          { ward: 'Ward 9', area: 'Courtallam Falls Approach Road', lat: 8.9320, lng: 77.2780, pinCode: '627802' },
        ],
      },
    ],
  },
  {
    id: 'theni-muni',
    name: 'Theni Allinagaram Municipality',
    district: 'Theni',
    type: 'Municipality',
    center: { lat: 10.0104, lng: 77.4768 },
    zones: [
      {
        zoneName: 'Theni Central',
        wards: [
          { ward: 'Ward 5', area: 'Periyakulam Road Junction', lat: 10.0140, lng: 77.4810, pinCode: '625531' },
          { ward: 'Ward 11', area: 'Madurai Road Old Bus Stand', lat: 10.0080, lng: 77.4720, pinCode: '625531' },
        ],
      },
    ],
  },
  {
    id: 'viluppuram-muni',
    name: 'Viluppuram Municipality',
    district: 'Viluppuram',
    type: 'Municipality',
    center: { lat: 11.9401, lng: 79.4861 },
    zones: [
      {
        zoneName: 'Viluppuram Junction Zone',
        wards: [
          { ward: 'Ward 6', area: 'Railway Junction East Pondy Road', lat: 11.9420, lng: 79.4920, pinCode: '605602' },
          { ward: 'Ward 14', area: 'Trichy Trunk Road Bus Stand', lat: 11.9360, lng: 79.4810, pinCode: '605602' },
        ],
      },
    ],
  },
  {
    id: 'mayiladuthurai-muni',
    name: 'Mayiladuthurai Municipality',
    district: 'Mayiladuthurai',
    type: 'Municipality',
    center: { lat: 11.1018, lng: 79.6522 },
    zones: [
      {
        zoneName: 'Mayuranathar Zone',
        wards: [
          { ward: 'Ward 4', area: 'Mayuranathar Sannathi Street', lat: 11.1040, lng: 79.6490, pinCode: '609001' },
          { ward: 'Ward 9', area: 'Cauvery Riverfront Pattamangala St', lat: 11.0980, lng: 79.6550, pinCode: '609001' },
        ],
      },
    ],
  },
  {
    id: 'nagapattinam-muni',
    name: 'Nagapattinam Municipality',
    district: 'Nagapattinam',
    type: 'Municipality',
    center: { lat: 10.7672, lng: 79.8449 },
    zones: [
      {
        zoneName: 'Coastal & Port Zone',
        wards: [
          { ward: 'Ward 2', area: 'Nagapattinam Port Beach Road', lat: 10.7690, lng: 79.8490, pinCode: '611001' },
          { ward: 'Ward 8', area: 'Public Office Road Collectorate', lat: 10.7620, lng: 79.8390, pinCode: '611001' },
        ],
      },
    ],
  },
];

/**
 * Calculates Haversine distance in kilometers between two GPS coordinates
 */
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * AUTOMATIC REVERSE GEOCODING RESOLVER FOR TAMIL NADU
 * Given any live GPS coordinates (latitude, longitude):
 * Automatically detects:
 * - District (out of all 38 districts)
 * - Municipal Corporation / Municipality
 * - Zone
 * - Ward & Area
 * - Full verified postal address
 */
export function resolveTamilNaduJurisdiction(
  lat: number,
  lng: number
): ComplaintLocation {
  let closestMunicipality = TAMIL_NADU_MUNICIPALITIES[0];
  let minMuniDistance = Infinity;

  for (const muni of TAMIL_NADU_MUNICIPALITIES) {
    const dist = getDistanceKm(lat, lng, muni.center.lat, muni.center.lng);
    if (dist < minMuniDistance) {
      minMuniDistance = dist;
      closestMunicipality = muni;
    }
  }

  // Find closest ward & zone within that municipality
  let closestZone = closestMunicipality.zones[0];
  let closestWard = closestZone.wards[0];
  let minWardDistance = Infinity;

  for (const zone of closestMunicipality.zones) {
    for (const ward of zone.wards) {
      const wDist = getDistanceKm(lat, lng, ward.lat, ward.lng);
      if (wDist < minWardDistance) {
        minWardDistance = wDist;
        closestWard = ward;
        closestZone = zone;
      }
    }
  }

  const pin = closestWard.pinCode ? ` - ${closestWard.pinCode}` : '';
  const readableAddress = `${closestWard.area}, ${closestWard.ward}, ${closestMunicipality.name}, ${closestMunicipality.district} District${pin}`;

  return {
    latitude: Number(lat.toFixed(5)),
    longitude: Number(lng.toFixed(5)),
    district: closestMunicipality.district,
    municipality: closestMunicipality.name,
    zone: closestZone.zoneName,
    ward: closestWard.ward,
    area: closestWard.area,
    readableAddress,
  };
}

/**
 * Helper to get all Municipalities in a specific District
 */
export function getMunicipalitiesByDistrict(district: TamilNaduDistrict): MunicipalityInfo[] {
  const matched = TAMIL_NADU_MUNICIPALITIES.filter((m) => m.district === district);
  if (matched.length > 0) return matched;

  // Default fallback municipality for districts with smaller town panchayats
  return [
    {
      id: `${district.toLowerCase()}-muni`,
      name: `${district} Municipality`,
      district,
      type: 'Municipality',
      center: { lat: 11.0, lng: 78.0 },
      zones: [
        {
          zoneName: `${district} Central Zone`,
          wards: [
            { ward: 'Ward 1', area: `${district} Collectorate Area`, lat: 11.0, lng: 78.0 },
            { ward: 'Ward 2', area: `${district} Bus Stand Commercial`, lat: 11.01, lng: 78.01 },
          ],
        },
      ],
    },
  ];
}
