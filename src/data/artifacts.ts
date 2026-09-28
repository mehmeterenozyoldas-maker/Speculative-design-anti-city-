import { HostileArtifact } from '../types';

export const HOSTILE_ARTIFACTS: HostileArtifact[] = [
  {
    id: 'camden-bench',
    name: 'The Camden Deterrent Bench',
    corporateEuphemism: 'Flow-Optimized Kinetic Street Plinth',
    typology: 'anti-sleeping',
    yearIntroduced: '2012 (London Borough of Camden)',
    municipalJustification: 'Engineered with non-porous concrete and angular anti-litter facets to promote seamless pedestrian circulation and prevent antisocial behaviors.',
    sociologicalReality: 'Explicitly designed as an architectural weapon against the unhoused: angular geometry makes horizontal lying impossible; lack of crevices rejects bags; sloped edges slide the human body off if balance is lost during sleep.',
    ergonomicFriction: 'Surface chamfer of 35° exerts shear pressure on the sacrum. Maximum continuous seated tolerance is approximately 14 minutes before musculoskeletal fatigue forces standing.',
    criticalCitation: {
      author: 'Rosalyn Deutsche',
      work: 'Evictions: Art and Spatial Politics (1996)',
      quote: 'Public space is not the harmonious realization of a common good, but the physical site where the conflict over who has the right to the city is violently staged.'
    },
    position: [-3.2, 0.18, 0.8],
    exclusionRadius: 2.8,
    tacticalIntervention: {
      name: 'Plywood Infill Leveler & Thermal Mattress',
      description: 'A CNC-cut interlocking birch plywood wedge that neutralizes the 35° chamfer, converting the hostile divide into a planar sleeping platform.',
      material: '18mm marine plywood, recycled wool felt padding',
      deployed: false
    }
  },
  {
    id: 'panopticon-pole',
    name: 'Autonomous Biometric Gaze Tower',
    corporateEuphemism: 'Civic Sentiment & Ambient Safety Node',
    typology: 'panoptic-surveillance',
    yearIntroduced: '2021 (Global Smart City Deployments)',
    municipalJustification: 'High-definition 360° optical sensors with on-edge neural computing to measure air quality, optimize micro-mobility traffic, and maintain public order.',
    sociologicalReality: 'Perpetual algorithmic panopticism: calculates pedestrian dwell time down to milliseconds, flagging non-consumptive stationary bodies as "aberrant" and alerting private security patrols or automated acoustic deterrence.',
    ergonomicFriction: 'Creates psychological claustrophobia; the visible rotating lens and projected laser perimeter induce anticipatory self-policing in public plazas.',
    criticalCitation: {
      author: 'Mike Davis',
      work: 'City of Quartz: Excavating the Future in Los Angeles (1990)',
      quote: 'The universal social goal of modern urban design is the destruction of public space and the architectural containment of the dangerous classes.'
    },
    position: [0, 0.18, -2.2],
    exclusionRadius: 4.5,
    tacticalIntervention: {
      name: 'Retro-Reflective Dazzler Shield',
      description: 'An array of high-intensity IR LEDs and retro-reflective micro-prisms that overexpose the camera sensor with blinding white glare while remaining invisible to the human eye.',
      material: '3M Scotchlite 8910 fabric + 850nm infrared strobe diode circuit',
      deployed: false
    }
  },
  {
    id: 'anti-rough-sleeping-spikes',
    name: 'Defensive Perimeter Studs (Spikes)',
    corporateEuphemism: 'Architectural Ledge Preservers',
    typology: 'physical-exclusion',
    yearIntroduced: '1998 / Escalated 2014',
    municipalJustification: 'Installed along commercial window ledges and recessed alcoves to preserve facade integrity and deter nocturnal loitering.',
    sociologicalReality: 'Literal medieval torture spikes translated into contemporary stainless steel. They criminalize the basic biological necessity of shelter under rain overhangs, transforming dry niches into zones of puncture hazard.',
    ergonomicFriction: '3.5-inch pyramidal hardened spikes spaced 8cm apart. Zero square inches of flat surface remain; contact with knees or torso punctures clothing and skin.',
    criticalCitation: {
      author: 'James C. Scott',
      work: 'Seeing Like a State (1998)',
      quote: 'State simplifications treat complex lived urban ecologies as unruly disorders that must be legibly disciplined into bare geometric sterility.'
    },
    position: [4.2, 0.18, -0.6],
    exclusionRadius: 2.2,
    tacticalIntervention: {
      name: 'EVA Foam Alcove Bridge',
      description: 'A dual-density closed-cell foam block with precision recesses cut into the bottom that slot directly over the spikes, turning the alcove into a cushioned bench.',
      material: 'Dual-density closed-cell EVA foam & ripstop Cordura shell',
      deployed: false
    }
  },
  {
    id: 'acoustic-mosquito',
    name: 'High-Frequency Ultrasonic Disperser ("The Mosquito")',
    corporateEuphemism: 'Acoustic Congregation Moderation Device',
    typology: 'acoustic-deterrent',
    yearIntroduced: '2005 (Compound Security Systems)',
    municipalJustification: 'Targeted frequency emission used to gently discourage juvenile loitering outside transit concourses without chemical or physical contact.',
    sociologicalReality: 'Weaponized bio-acoustic warfare: emits pulsed 17.4 kHz tones that exploit presbycusis (age-related hearing degradation) to inflict acute ear pain and nausea exclusively on youth and children while elderly city planners remain oblivious.',
    ergonomicFriction: 'Produces inner-ear tympanic stress, severe headaches, and disorientation within 90 seconds of continuous exposure in the acoustic cone.',
    criticalCitation: {
      author: 'Steve Goodman',
      work: 'Sonic Warfare: Sound, Affect, and the Ecology of Fear (2009)',
      quote: 'Sonic weapons do not wound the body directly with ballistic mass; they occupy the nervous system, turning the victim’s own auditory physiology into the site of trauma.'
    },
    position: [3.8, 2.9, -3.95],
    exclusionRadius: 3.5,
    tacticalIntervention: {
      name: 'Acoustic Muffler Cone & Resonator Jammer',
      description: 'A magnetically attached directional sound baffle lined with recycled melamine acoustic foam that cancels the 17.4 kHz emission through phase inversion.',
      material: 'Neodymium magnets, basotect acoustic foam, tuned Helmholtz resonator',
      deployed: false
    }
  },
  {
    id: 'anti-sit-leaner',
    name: 'The 65° Anti-Sit Transit Perch',
    corporateEuphemism: 'Rapid-Egress Postural Support Rail',
    typology: 'anti-sleeping',
    yearIntroduced: '2016 (Subway & Bus Stop Revitalizations)',
    municipalJustification: 'Space-saving micro-furniture allowing commuters to briefly rest during high-frequency transit intervals while conserving sidewalk width.',
    sociologicalReality: 'Complete abolition of sitting: elderly, disabled, or fatigued pedestrians cannot sit; they are forced to brace against a cold metal pipe at an uncomfortable 65° incline that continuously strains the quadriceps.',
    ergonomicFriction: 'Requires 35% continuous isometric leg muscle contraction to maintain position without sliding forward. Rest is rendered punitive.',
    criticalCitation: {
      author: 'Carl DiSalvo',
      work: 'Adversarial Design (MIT Press, 2012)',
      quote: 'Adversarial design does not seek consensus or frictionless experience; it exposes the contested political arrangements embedded within mundane artifacts.'
    },
    position: [-2.6, 0.18, -2.6],
    exclusionRadius: 2.0,
    tacticalIntervention: {
      name: 'Suspension Seat Harness',
      description: 'A fold-out tensile fabric sling with rubberized carabiners that clips between the perch uprights, instantly forming a full-depth ergonomic hammock chair.',
      material: 'Ballistic nylon webbing, aircraft-grade aluminum tension clips',
      deployed: false
    }
  }
];
