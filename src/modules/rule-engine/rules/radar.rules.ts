import { Rule } from '../types/rule.types';

export const radarRulesConfig: Rule[] = [
  {
    id: 'owner_contact',
    name: 'Owner Contact',
    description: 'Detects if the property is sold directly by owner',
    priority: 10,
    enabled: true,
    conditions: [
      { field: 'text', type: 'regex', value: '(owner|proprietar)' }
    ],
    effects: [
      { type: 'increaseScore', value: 15 },
      { type: 'addStrength', value: 'Direct owner contact implies higher margin.' }
    ]
  },
  {
    id: 'urgent_sale',
    name: 'Urgent Sale',
    description: 'Detects urgency in the sale',
    priority: 10,
    enabled: true,
    conditions: [
      { field: 'text', type: 'regex', value: '(urgent|negociabil|ocazie)' }
    ],
    effects: [
      { type: 'increaseScore', value: 10 },
      { type: 'addStrength', value: 'Urgent sale signals higher flexibility on price.' }
    ]
  },
  {
    id: 'new_property',
    name: 'New Property',
    description: 'Detects if the property is new',
    priority: 10,
    enabled: true,
    conditions: [
      { field: 'text', type: 'regex', value: '(new|nou|recent)' }
    ],
    effects: [
      { type: 'increaseScore', value: 10 },
      { type: 'addStrength', value: 'Newer properties typically yield better opportunities.' }
    ]
  },
  {
    id: 'agency_involvement',
    name: 'Agency Involvement',
    description: 'Detects if another agency is involved',
    priority: 20, 
    enabled: true,
    conditions: [
      { field: 'text', type: 'regex', value: '(commission|comision|agentie|agency)' }
    ],
    effects: [
      { type: 'decreaseScore', value: 20 },
      { type: 'addWeakness', value: 'Involvement of another agency reduces margin.' }
    ]
  },
  {
    id: 'high_value_area',
    name: 'High Value Area',
    description: 'Detects premium location',
    priority: 10,
    enabled: true,
    conditions: [
      { field: 'text', type: 'regex', value: '(pipera|herastrau|primaverii|dorobanti|nord)' }
    ],
    effects: [
      { type: 'increaseScore', value: 20 },
      { type: 'addStrength', value: 'High-value market area detected.' }
    ]
  },
  {
    id: 'litigation',
    name: 'Litigation Risk',
    description: 'Detects legal issues',
    priority: 100, // Highest priority to set critical risk first
    enabled: true,
    conditions: [
      { field: 'text', type: 'regex', value: '(litigiu|probleme|viciu|demolare)' }
    ],
    effects: [
      { type: 'decreaseScore', value: 30 },
      { type: 'addWeakness', value: 'Legal or structural issues identified.' },
      { type: 'setRisk', value: 'High' },
      { type: 'setPriority', value: 'Low priority. Proceed with caution or archive.' }
    ]
  },
  {
    id: 'premium_condition',
    name: 'Premium Condition',
    description: 'Detects luxury finishes',
    priority: 10,
    enabled: true,
    conditions: [
      { field: 'text', type: 'regex', value: '(renovat|lux|premium)' }
    ],
    effects: [
      { type: 'increaseScore', value: 10 },
      { type: 'addStrength', value: 'Premium condition increases property appeal.' }
    ]
  },
  {
    id: 'type_apartment',
    name: 'Type Apartment',
    description: 'Detects apartment type',
    priority: 10,
    enabled: true,
    conditions: [
      { field: 'text', type: 'regex', value: '(apartament|garsoniera)' }
    ],
    effects: [
      { type: 'setPropertyType', value: 'Apartment' }
    ]
  },
  {
    id: 'type_house',
    name: 'Type House',
    description: 'Detects house type',
    priority: 10,
    enabled: true,
    conditions: [
      { field: 'text', type: 'regex', value: '(casa|vila)' }
    ],
    effects: [
      { type: 'setPropertyType', value: 'House/Villa' }
    ]
  },
  {
    id: 'type_land',
    name: 'Type Land',
    description: 'Detects land type',
    priority: 10,
    enabled: true,
    conditions: [
      { field: 'text', type: 'regex', value: '(teren)' }
    ],
    effects: [
      { type: 'setPropertyType', value: 'Land' }
    ]
  }
];
