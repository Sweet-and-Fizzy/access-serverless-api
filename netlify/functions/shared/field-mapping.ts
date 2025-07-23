// Define field mappings for different request types
export const requestTypeFields: Record<number, Record<string, string>> = {
    // Request Type: Support Ticket
  17: {
    summary: 'summary',
    description: 'description',
    accessId: 'customfield_10103',
    name: 'customfield_10108',
    issueType: 'customfield_10111',
    priority: 'priority'
  },
  // Request Type: Login to Access (loginAccess)
  30: {
    name: 'customfield_10108',
    accessId: 'customfield_10103',
    description: 'description'
  },
  // Request Type: Login to provider (loginProvider)
  31: {
    name: 'customfield_10108',
    accessId: 'customfield_10103',
    accessResource: 'customfield_10110',
    accessResourceUserId: 'customfield_10112',
    description: 'description'
  },
  // Request Type: Security Incident
  26: {
    summary: 'summary',
    priority: 'priority',
    description: 'description',
    name: 'customfield_10108',
    accessId: 'customfield_10103'
    // email is handled via raiseOnBehalfOf in the API
  },
}

// Priority mapping - maps user-friendly values to JSM priority IDs/names
const priorityMapping: Record<string, string> = {
  'low': '5',
  'medium': '3',
  'high': '2',
  'highest': '1',
  'lowest': '4',
  // Also accept numeric strings directly
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5'
};

// Issue type mapping for customfield_10111 (ACCESS User Support Issue)
const issueTypeMapping: Record<string, string> = {
  'user account question': '10212',
  'allocation question': '10213',
  'user support question': '10214',
  'cssn/ccep question': '10216',
  'training question': '10217',
  'metrics question': '10218',
  'ondemand question': '10219',
  'pegasus question': '10220',
  'xdmod question': '10221',
  'some other question': '10223',
  // Also accept the value IDs directly
  '10212': '10212',
  '10213': '10213',
  '10214': '10214',
  '10216': '10216',
  '10217': '10217',
  '10218': '10218',
  '10219': '10219',
  '10220': '10220',
  '10221': '10221',
  '10223': '10223'
};

// ACCESS Resource mapping for customfield_10110 (ACCESS Resource)
const accessResourceChoiceMapping: Record<string, string> = {
  'aces': '10197',
  'anvil': '10198',
  'bridges-2': '10199',
  'darwin': '10200',
  'delta': '10201',
  'deltaai': '10852',
  'derecho': '10846',
  'expanse': '10202',
  'faster': '10203',
  'granite': '10988',
  'jetstream2': '10204',
  'kyric': '10206',
  'launch': '10853',
  'neocortex': '10718',
  'ookami': '10205',
  'open science grid': '10210',
  'open storage network': '10211',
  'ranch': '10209',
  'stampede3': '10784',
  // Also accept the value IDs directly
  '10197': '10197',
  '10198': '10198',
  '10199': '10199',
  '10200': '10200',
  '10201': '10201',
  '10852': '10852',
  '10846': '10846',
  '10202': '10202',
  '10203': '10203',
  '10988': '10988',
  '10204': '10204',
  '10206': '10206',
  '10853': '10853',
  '10718': '10718',
  '10205': '10205',
  '10210': '10210',
  '10211': '10211',
  '10209': '10209',
  '10784': '10784'
};

// Keyword choice mapping for customfield_10113 (comprehensive list from JSM)
const keywordChoiceMapping: Record<string, string> = {
  ' c, c++': '10285',
  'abaqus': '10254',
  'access': '10520',
  'access-credits': '10228',
  'access-website': '10229',
  'accounts': '10255',
  'acls': '10256',
  'adding users': '10257',
  'affiliations': '10258',
  'affinity groups': '10259',
  'ai': '10260',
  'algorithms': '10240',
  'allocation extension': '10264',
  'allocation management': '10261',
  'allocation proposal': '10265',
  'allocation time': '10262',
  'allocation users': '10263',
  'amber': '10266',
  'amie': '10267',
  'anaconda': '10268',
  'analysis': '10239',
  'api': '10269',
  'application status': '10270',
  'arcgis': '10271',
  'architecture': '10243',
  'archiving': '10272',
  'astrophysics': '10273',
  'atlas': '10274',
  'authentication': '10275',
  'aws': '10276',
  'azure': '10277',
  'backup': '10278',
  'bash': '10279',
  'batch jobs': '10280',
  'benchmarking': '10281',
  'big data': '10282',
  'bioinformatics': '10283',
  'biology': '10284',
  'ceph': '10286',
  'cfd': '10302',
  'cgroups': '10287',
  'charmm': '10288',
  'checkpoint': '10289',
  'cilogon': '10290',
  'citation': '10291',
  'cloud': '10230',
  'cloud computing': '10292',
  'cloud lab': '10294',
  'cloud storage': '10293',
  'cluster management': '10295',
  'cluster support': '10296',
  'cmmc': '10297',
  'community outreach': '10298',
  'compiling': '10299',
  'composible systems': '10300',
  'computataional chemistry': '10301',
  'comsol': '10303',
  'conda': '10304',
  'condo': '10305',
  'containers': '10306',
  'core dump': '10307',
  'core hours': '10308',
  'cp2k': '10309',
  'cpu architecture': '10310',
  'cpu bound': '10311',
  'cuda': '10312',
  'cybersecurity': '10313',
  'cyverse': '10314',
  'data': '10241',
  'data storage': '10233',
  'data-access-protocols': '10315',
  'data-analysis': '10316',
  'data-compliance': '10317',
  'data-lifecycle': '10318',
  'data-management': '10319',
  'data-management-software': '10320',
  'data-provenance': '10321',
  'data-reproducibility': '10322',
  'data-retention': '10323',
  'data-science': '10324',
  'data-sharing': '10325',
  'data-transfer': '10326',
  'data-wrangling': '10327',
  'database-update': '10328',
  'debugging': '10329',
  'debugging, optimizatio and profiling': '10231',
  'deep-learning': '10330',
  'dependencies': '10331',
  'deployment': '10332',
  'dft': '10333',
  'distributed-computing': '10334',
  'dns': '10232',
  'docker': '10335',
  'documentation': '10336',
  'doi': '10337',
  'dtn': '10338',
  'easybuild': '10339',
  'email': '10340',
  'encryption': '10341',
  'environment-modules': '10342',
  'errors': '10343',
  'extension': '10344',
  'fastx': '10345',
  'federated-authentication': '10346',
  'file transfers': '10237',
  'file-formats': '10347',
  'file-limits': '10348',
  'file-systems': '10349',
  'file-transfer': '10350',
  'finite-element-analysis': '10351',
  'firewall': '10352',
  'fortran': '10353',
  'frameworks and ide\'s': '10251',
  'gamess': '10354',
  'gateways': '10234',
  'gatk': '10355',
  'gaussian': '10356',
  'gcc': '10357',
  'genomics': '10358',
  'gis': '10359',
  'git': '10360',
  'globus': '10361',
  'gpfs': '10362',
  'gpu': '10363',
  'gravitational-waves': '10364',
  'gridengine': '10365',
  'gromacs': '10366',
  'hadoop': '10367',
  'hardware': '10244',
  'image-processing': '10368',
  'infiniband': '10369',
  'interactive-mode': '10370',
  'interconnect': '10371',
  'io-issue': '10245',
  'isilon': '10372',
  'java': '10373',
  'jekyll': '10374',
  'jetstream': '10375',
  'job-accounting': '10376',
  'job-array': '10377',
  'job-charging': '10378',
  'job-failure': '10379',
  'job-sizing': '10380',
  'job-submission': '10381',
  'julia': '10382',
  'jupyterhub': '10383',
  'key-management': '10384',
  'kubernetes': '10385',
  'kyric': '10386',
  'lammps': '10387',
  'library-paths': '10388',
  'license': '10389',
  'linear-programming': '10390',
  'linux': '10246',
  'lmod': '10391',
  'login': '10226',
  'lsf': '10392',
  'lustre': '10393',
  'machine-learning': '10394',
  'management': '10395',
  'materials-science': '10396',
  'mathematica': '10397',
  'matlab': '10398',
  'memory': '10399',
  'metadata': '10400',
  'modules': '10401',
  'molecular-dynamics': '10402',
  'monte-carlo': '10403',
  'mpi': '10404',
  'namd': '10405',
  'netcdf': '10407',
  'networking': '10408',
  'neural-networks': '10409',
  'nfs': '10410',
  'nlp': '10406',
  'nomachine': '10411',
  'nvidia': '10412',
  'oceanography': '10413',
  'ondemnad': '10414',
  'open-science-grid': '10415',
  'open-storage-network': '10416',
  'opencv': '10417',
  'openfoam': '10418',
  'openmp': '10419',
  'openmpi': '10420',
  'openshift': '10421',
  'openstack': '10422',
  'optimization': '10423',
  'os': '10424',
  'osg': '10425',
  'parallelization': '10426',
  'parameter-sweeps': '10427',
  'paraview': '10428',
  'particle-physics': '10429',
  'password': '10227',
  'pbs': '10430',
  'pegasus': '10431',
  'pending-jobs': '10432',
  'performance-tuning': '10433',
  'permissions': '10434',
  'physiology': '10435',
  'pip': '10436',
  'podman': '10437',
  'portals': '10242',
  'pre-emption': '10438',
  'professional and workforce development': '10249',
  'professional-development': '10439',
  'profile': '10440',
  'profiling': '10441',
  'programming': '10442',
  'programming languages': '10250',
  'programming-best-practices': '10443',
  'project-management': '10444',
  'project-renewal': '10445',
  'provisioning': '10446',
  'pthreads': '10447',
  'publication-database': '10448',
  'putty': '10449',
  'python': '10450',
  'pytorch': '10451',
  'quantum-computing': '10452',
  'quantum-mechanics': '10453',
  'quota': '10454',
  'r': '10455',
  'rdp': '10456',
  'react': '10457',
  'reporting': '10458',
  'research-facilitation': '10459',
  'research-grants': '10460',
  'resources': '10461',
  'rstudio-server': '10462',
  's3': '10463',
  'samba': '10464',
  'sas': '10465',
  'scaling': '10466',
  'schedulers': '10235',
  'scheduling': '10467',
  'science dmz': '10469',
  'science gateways': '10468',
  'scikit-learn': '10470',
  'scratch': '10252',
  'screen': '10471',
  'scripting': '10472',
  'sdn': '10474',
  'secure computing and data': '10253',
  'secure-data-architecture': '10475',
  'serverless-hpc': '10476',
  'setup': '10477',
  'sftp': '10478',
  'sge': '10479',
  'shell scripting': '10248',
  'shifter': '10480',
  'singularity': '10481',
  'slurm': '10482',
  'smb': '10483',
  'smrtanalysis': '10484',
  'software installations': '10236',
  'software-carpentry': '10485',
  'spack': '10486',
  'spark': '10487',
  'spectrum-scale': '10488',
  'spss': '10489',
  'sql': '10490',
  'ssh': '10473',
  'stampede2': '10491',
  'stata': '10492',
  'storage': '10493',
  'supplement': '10494',
  'support': '10238',
  'tcp': '10495',
  'technical-training-for-hpc': '10496',
  'tensorflow': '10497',
  'terminal-emulation-and-window-management': '10498',
  'tickets': '10499',
  'timing-issue': '10500',
  'tmux': '10501',
  'tools': '10247',
  'training': '10502',
  'transfer sus': '10503',
  'trinity': '10504',
  'tuning': '10505',
  'unix-environment': '10506',
  'upgrading': '10507',
  'vectorization': '10508',
  'version-control': '10509',
  'vim': '10510',
  'vnc': '10511',
  'vpn': '10512',
  'workflow': '10513',
  'workforce-development': '10514',
  'x11': '10515',
  'xalt': '10516',
  'xdmod': '10517',
  'xml': '10518',
  'xsede': '10519',
  'i don\'t see a relevant keyword': '0' // Special case for "other"
};

// ProForma question mappings for different request types
const proformaQuestionMappings: Record<number, Record<string, string>> = {
  // Request Type 17: Support Ticket - Uses ProForma form questions
  17: {
    hasResourceProblem: '1',    // Question 1: "Does your problem involve an ACCESS Resource" (Yes/No)
    userIdAtResource: '5',      // Question 5: "Your User ID (at the Resource)" (text)
    resourceName: '8',          // Question 8: "Resource" (dropdown)
    keywords: '9',              // Question 9: "Keywords" (multi-select)
    noRelevantKeyword: '10',    // Question 10: "I don't see a relevant keyword" (checkbox)
    suggestedKeyword: '13'      // Question 13: "Suggested Keyword" (text)
  },
  // Request Type 30: Cannot login to the ACCESS portal
  30: {
    identityProvider: '16',     // Question 16: "Identity Provider" (dropdown)
    browser: '17'               // Question 17: "Browser" (multi-select)
  },
  // Request Type 31: Cannot login to Resource Provider
  31: {
    userIdAtResource: '5'       // Question 5: "Your User ID (at the Resource)" (text)
  }
};

// ProForma field type mappings - defines how each field should be formatted
const proformaFieldTypes: Record<string, 'text' | 'choices'> = {
  // Request Type 17 fields
  '1': 'choices',    // hasResourceProblem - dropdown (single choice) - Yes/No
  '5': 'text',       // userIdAtResource - text field
  '8': 'choices',    // resourceName - dropdown (single choice)
  '9': 'choices',    // keywords - multi-select (multiple choices)
  '10': 'choices',   // noRelevantKeyword - checkbox (choices)
  '13': 'text',      // suggestedKeyword - text field for additional keywords
  // Request Type 30 fields
  '16': 'choices',   // identityProvider - dropdown (single choice)
  '17': 'choices',   // browser - multi-select (multiple choices)
  // Request Type 31 fields - Note: Question 5 is used in both RT 17 and 31
};

/**
 * Maps priority values to JSM format
 * @param priority The priority value from user input
 * @returns JSM-compatible priority value object
 */
function mapPriorityValue(priority: any): { id: string } {
  if (!priority) {
    return { id: '3' }; // Default to medium priority
  }

  const priorityStr = String(priority).toLowerCase();
  const priorityId = priorityMapping[priorityStr] || '3'; // Default to medium if not found
  return { id: priorityId };
}

/**
 * Maps issue type values to JSM format for customfield_10111
 * @param issueType The issue type value from user input
 * @returns JSM-compatible issue type value object
 */
function mapIssueTypeValue(issueType: any): { id: string } {
  if (!issueType) {
    return { id: '10214' }; // Default to "User Support Question"
  }

  const issueTypeStr = String(issueType).toLowerCase();
  const issueTypeId = issueTypeMapping[issueTypeStr] || '10214'; // Default to "User Support Question" if not found
  return { id: issueTypeId };
}

/**
 * Maps ACCESS resource values to JSM format for customfield_10110
 * @param accessResource The resource name from user input
 * @returns JSM-compatible access resource value object
 */
function mapAccessResourceValue(accessResource: any): { id: string } {
  if (!accessResource) {
    return { id: '10202' }; // Default to "Expanse" if not specified
  }

  const resourceStr = String(accessResource).toLowerCase();
  const resourceId = accessResourceChoiceMapping[resourceStr];

  if (!resourceId) {
    console.warn(`Unknown ACCESS resource: ${accessResource}, defaulting to Expanse`);
    return { id: '10202' }; // Default to "Expanse" if not found
  }

  return { id: resourceId };
}

/**
 * Maps keywords values to JSM format for customfield_10113 (ACCESS TAGS - multi-select)
 * @param keywords The keywords from user input (can be array or comma-separated string)
 * @returns JSM-compatible keywords value array
 */
function mapKeywordsValue(keywords: any): { id: string }[] {
  if (!keywords) {
    return [{ id: '0' }]; // Default to "I don't see a relevant keyword"
  }

  let keywordArray: string[];
  if (Array.isArray(keywords)) {
    keywordArray = keywords.map(k => String(k).toLowerCase().trim());
  } else {
    keywordArray = String(keywords).split(',').map(k => k.toLowerCase().trim());
  }

  const mappedKeywords = keywordArray
    .map(keyword => {
      const keywordId = keywordChoiceMapping[keyword];
      if (!keywordId) {
        console.warn(`Unknown keyword: ${keyword}, skipping`);
        return null;
      }
      return { id: keywordId };
    })
    .filter(Boolean);

  // If no valid keywords found, return "I don't see a relevant keyword"
  return mappedKeywords.length > 0 ? mappedKeywords : [{ id: '0' }];
}

/**
 * Maps suggested keyword values to JSM format for customfield_10115 (ACCESS Suggested TAG)
 * @param suggestedKeyword The suggested keyword from user input
 * @returns JSM-compatible suggested keyword value object
 */
function mapSuggestedKeywordValue(suggestedKeyword: any): { id: string } {
  const keywordStr = String(suggestedKeyword).toLowerCase().trim();

  // Handle the explicit "I don't see a relevant keyword" case
  if (keywordStr === "i don't see a relevant keyword" || keywordStr === "i don't see a relevant keyword") {
    return { id: '0' };
  }

  const keywordId = keywordChoiceMapping[keywordStr];

  if (!keywordId) {
    console.warn(`Unknown suggested keyword: ${suggestedKeyword}, defaulting to "I don't see a relevant keyword"`);
    return { id: '0' }; // Default to "I don't see a relevant keyword" if not found
  }

  return { id: keywordId };
}

/**
 * Maps ProForma choice values to their corresponding choice IDs
 * @param questionId The ProForma question ID
 * @param choiceValue The user-selected choice value
 * @returns The mapped choice ID or null if not found
 */
function mapProFormaChoice(questionId: string, choiceValue: string): string | null {
  const value = choiceValue.toLowerCase().trim();

  // Question 16 & 21: Identity Provider (ProForma choice IDs)
  if (questionId === '16' || questionId === '21') {
    const identityProviderMap: Record<string, string> = {
      'access': '3',
      'github': '6',
      'google': '4',
      'institution': '1',
      'microsoft': '5',
      'orcid': '2',
      'other': '0'
    };
    return identityProviderMap[value] || null;
  }

  // Question 17 & 22: Browser (ProForma choice IDs)
  if (questionId === '17' || questionId === '22') {
    const browserMap: Record<string, string> = {
      'chrome': '4',
      'firefox': '3',
      'edge': '5',
      'safari': '6',
      'other': '0'
    };
    return browserMap[value] || null;
  }

  // Question 8: Resource Name (handle multiple resources)
  if (questionId === '8') {
    const resourceMap: Record<string, string> = {
      'aces': '10197',
      'anvil': '10198',
      'bridges-2': '10199',
      'darwin': '10200',
      'delta': '10201',
      'deltaai': '10852',
      'derecho': '10846',
      'expanse': '10202',
      'faster': '10203',
      'granite': '10988',
      'jetstream2': '10204',
      'kyric': '10206',
      'launch': '10853',
      'neocortex': '10718',
      'ookami': '10205',
      'open science grid': '10210',
      'open storage network': '10211',
      'ranch': '10209',
      'stampede3': '10784'
    };

    const mappedId = resourceMap[value?.toLowerCase()] || null;
    console.log(`🔧 Resource mapping: "${value?.toLowerCase()}" -> "${mappedId}"`);
    return mappedId;
  }

  // Question 9: Keywords (use keyword choice mapping)
  if (questionId === '9') {
    return keywordChoiceMapping[value] || null;
  }

  // Question 10: I don't see a relevant keyword (checkbox)
  if (questionId === '10') {
    // This is a checkbox - if user provided suggested keyword, check the box
    return '1'; // Choice ID for "I don't see a relevant keyword"
  }

  // Question 13: Suggested Keyword (use keyword choice mapping)
  if (questionId === '13') {
    return keywordChoiceMapping[value] || null;
  }

  // Question 1: Has Resource Problem (Yes/No)
  if (questionId === '1') {
    const yesNoMap: Record<string, string> = {
      'yes': '1',
      'no': '2',
      'Yes': '1',   // Handle frontend sending 'Yes'
      'No': '2'     // Handle frontend sending 'No'
    };
    return yesNoMap[value] || null;
  }

  // Default: return the value as-is
  return choiceValue;
}

/**
 * Maps user input values to JSM field values based on request type
 * @param requestTypeId The type of request being created
 * @param userInputValues The values provided by the user
 * @returns Formatted field values for JSM API
 */
export function mapFieldValues(requestTypeId: number, userInputValues: Record<string, any>): Record<string, any> {
  const fieldMapping = requestTypeFields[requestTypeId];

  if (!fieldMapping) {
    console.warn(`No field mapping found for request type ${requestTypeId}`);
    return {};
  }

  const formattedFieldValues: Record<string, any> = {};

  Object.keys(fieldMapping).forEach(fieldKey => {
    if (userInputValues[fieldKey] !== undefined) {
      let value = userInputValues[fieldKey];

      // Skip empty values to avoid sending blanks to JSM
      if (value === '' || value === null) {
        return;
      }

      // Special handling for priority field
      if (fieldKey === 'priority') {
        value = mapPriorityValue(value);
      }

      // Special handling for issue type field
      if (fieldKey === 'issueType') {
        value = mapIssueTypeValue(value);
      }

      // Special handling for access resource field
      if (fieldKey === 'accessResource') {
        value = mapAccessResourceValue(value);
      }


      formattedFieldValues[fieldMapping[fieldKey]] = value;
    }
  });

  console.log(`📋 Mapped ${Object.keys(formattedFieldValues).length} fields for request type ${requestTypeId}`);

  return formattedFieldValues;
}

/**
 * Maps ProForma field values to JSM form format
 * @param requestTypeId The type of request being created
 * @param userInputValues The values provided by the user
 * @returns Formatted ProForma answers for JSM API form section, or null if no ProForma fields
 */
export function mapProformaValues(requestTypeId: number, userInputValues: Record<string, any>): Record<string, any> | null {
  const questionMapping = proformaQuestionMappings[requestTypeId];

  if (!questionMapping) {
    // No ProForma fields for this request type
    return null;
  }

  const formattedAnswers: Record<string, any> = {};
  let hasProformaData = false;

  Object.keys(questionMapping).forEach(fieldKey => {
    if (userInputValues[fieldKey] !== undefined && userInputValues[fieldKey] !== '' && userInputValues[fieldKey] !== null) {
      const questionId = questionMapping[fieldKey];
      const fieldType = proformaFieldTypes[questionId];
      let value = userInputValues[fieldKey];

      hasProformaData = true;

      if (fieldType === 'text') {
        formattedAnswers[questionId] = { text: String(value) };
      } else if (fieldType === 'choices') {
        // Map choice values to ProForma choice IDs
        let mappedChoices: string[] = [];

        if (Array.isArray(value)) {
          mappedChoices = value.map(choice => mapProFormaChoice(questionId, String(choice))).filter(Boolean);
        } else {
          const choices = String(value).split(',').map(choice => choice.trim());
          mappedChoices = choices.map(choice => mapProFormaChoice(questionId, choice)).filter(Boolean);
        }

        if (mappedChoices.length > 0) {
          formattedAnswers[questionId] = { choices: mappedChoices };
        }
      }
    }
  });

  if (!hasProformaData) {
    return null;
  }

  console.log(`📝 Mapped ${Object.keys(formattedAnswers).length} ProForma fields for request type ${requestTypeId}`);

  return formattedAnswers;
}