const REGION_FLAG_REGEX = /[\u{1F1E0}-\u{1F1FF}]{2}/gu

// 地区emoji到名称的映射
export const emojiToRegionMap: Record<string, { en: string, zh: string, code: string, aliases: string[] }> = {
  '🇭🇰': {
    en: 'Hong Kong',
    zh: '香港',
    code: 'HK',
    aliases: ['hk', 'hongkong', 'hong kong', '香港', 'HK'],
  },
  '🇨🇳': {
    en: 'China',
    zh: '中國',
    code: 'CN',
    aliases: ['cn', 'china', '中国', '中华人民共和国', 'prc', 'CN'],
  },
  '🇺🇸': {
    en: 'United States',
    zh: '美國',
    code: 'US',
    aliases: ['us', 'usa', 'united states', 'america', '美国', '美利坚', 'US', 'USA'],
  },
  '🇯🇵': {
    en: 'Japan',
    zh: '日本',
    code: 'JP',
    aliases: ['jp', 'japan', '日本', 'JP'],
  },
  '🇰🇷': {
    en: 'South Korea',
    zh: '韓國',
    code: 'KR',
    aliases: ['kr', 'korea', 'south korea', '韩国', '南韩', 'KR'],
  },
  '🇸🇬': {
    en: 'Singapore',
    zh: '新加坡',
    code: 'SG',
    aliases: ['sg', 'singapore', '新加坡', 'SG'],
  },
  '🇹🇼': {
    en: 'Taiwan',
    zh: '台灣',
    code: 'TW',
    aliases: ['tw', 'taiwan', '台湾', '台灣', 'TW'],
  },
  '🇬🇧': {
    en: 'United Kingdom',
    zh: '英國',
    code: 'GB',
    aliases: ['gb', 'uk', 'united kingdom', 'britain', '英国', '英國', 'GB', 'UK'],
  },
  '🇩🇪': {
    en: 'Germany',
    zh: '德國',
    code: 'DE',
    aliases: ['de', 'germany', 'deutschland', '德国', '德國', 'DE'],
  },
  '🇫🇷': {
    en: 'France',
    zh: '法國',
    code: 'FR',
    aliases: ['fr', 'france', '法国', '法國', 'FR'],
  },
  '🇨🇦': {
    en: 'Canada',
    zh: '加拿大',
    code: 'CA',
    aliases: ['ca', 'canada', '加拿大', 'CA'],
  },
  '🇦🇺': {
    en: 'Australia',
    zh: '澳洲',
    code: 'AU',
    aliases: ['au', 'australia', '澳大利亚', '澳洲', 'AU'],
  },
  '🇷🇺': {
    en: 'Russia',
    zh: '俄羅斯',
    code: 'RU',
    aliases: ['ru', 'russia', '俄罗斯', '俄國', 'RU'],
  },
  '🇮🇳': {
    en: 'India',
    zh: '印度',
    code: 'IN',
    aliases: ['in', 'india', '印度', 'IN'],
  },
  '🇧🇷': {
    en: 'Brazil',
    zh: '巴西',
    code: 'BR',
    aliases: ['br', 'brazil', '巴西', 'BR'],
  },
  '🇳🇱': {
    en: 'Netherlands',
    zh: '荷蘭',
    code: 'NL',
    aliases: ['nl', 'netherlands', 'holland', '荷兰', '荷蘭', 'NL'],
  },
  '🇮🇹': {
    en: 'Italy',
    zh: '義大利',
    code: 'IT',
    aliases: ['it', 'italy', '意大利', 'IT'],
  },
  '🇪🇸': {
    en: 'Spain',
    zh: '西班牙',
    code: 'ES',
    aliases: ['es', 'spain', '西班牙', 'ES'],
  },
  '🇸🇪': {
    en: 'Sweden',
    zh: '瑞典',
    code: 'SE',
    aliases: ['se', 'sweden', '瑞典', 'SE'],
  },
  '🇳🇴': {
    en: 'Norway',
    zh: '挪威',
    code: 'NO',
    aliases: ['no', 'norway', '挪威', 'NO'],
  },
  '🇫🇮': {
    en: 'Finland',
    zh: '芬蘭',
    code: 'FI',
    aliases: ['fi', 'finland', '芬兰', '芬蘭', 'FI'],
  },
  '🇨🇭': {
    en: 'Switzerland',
    zh: '瑞士',
    code: 'CH',
    aliases: ['ch', 'switzerland', '瑞士', 'CH'],
  },
  '🇦🇹': {
    en: 'Austria',
    zh: '奥地利',
    code: 'AT',
    aliases: ['at', 'austria', '奥地利', '奧地利', 'AT'],
  },
  '🇧🇪': {
    en: 'Belgium',
    zh: '比利時',
    code: 'BE',
    aliases: ['be', 'belgium', '比利时', '比利時', 'BE'],
  },
  '🇵🇹': {
    en: 'Portugal',
    zh: '葡萄牙',
    code: 'PT',
    aliases: ['pt', 'portugal', '葡萄牙', 'PT'],
  },
  '🇬🇷': {
    en: 'Greece',
    zh: '希臘',
    code: 'GR',
    aliases: ['gr', 'greece', '希腊', '希臘', 'GR'],
  },
  '🇹🇷': {
    en: 'Turkey',
    zh: '土耳其',
    code: 'TR',
    aliases: ['tr', 'turkey', '土耳其', 'TR'],
  },
  '🇵🇱': {
    en: 'Poland',
    zh: '波蘭',
    code: 'PL',
    aliases: ['pl', 'poland', '波兰', '波蘭', 'PL'],
  },
  '🇨🇿': {
    en: 'Czech Republic',
    zh: '捷克',
    code: 'CZ',
    aliases: ['cz', 'czech', 'czech republic', '捷克', 'CZ'],
  },
  '🇭🇺': {
    en: 'Hungary',
    zh: '匈牙利',
    code: 'HU',
    aliases: ['hu', 'hungary', '匈牙利', 'HU'],
  },
  '🇷🇴': {
    en: 'Romania',
    zh: '羅馬尼亞',
    code: 'RO',
    aliases: ['ro', 'romania', '罗马尼亚', '羅馬尼亞', 'RO'],
  },
  '🇧🇬': {
    en: 'Bulgaria',
    zh: '保加利亞',
    code: 'BG',
    aliases: ['bg', 'bulgaria', '保加利亚', '保加利亞', 'BG'],
  },
  '🇭🇷': {
    en: 'Croatia',
    zh: '克羅埃西亞',
    code: 'HR',
    aliases: ['hr', 'croatia', '克罗地亚', '克羅地亞', 'HR'],
  },
  '🇸🇮': {
    en: 'Slovenia',
    zh: '斯洛維尼亞',
    code: 'SI',
    aliases: ['si', 'slovenia', '斯洛文尼亚', '斯洛文尼亞', 'SI'],
  },
  '🇸🇰': {
    en: 'Slovakia',
    zh: '斯洛伐克',
    code: 'SK',
    aliases: ['sk', 'slovakia', '斯洛伐克', 'SK'],
  },
  '🇱🇻': {
    en: 'Latvia',
    zh: '拉脫維亞',
    code: 'LV',
    aliases: ['lv', 'latvia', '拉脱维亚', '拉脫維亞', 'LV'],
  },
  '🇱🇹': {
    en: 'Lithuania',
    zh: '立陶宛',
    code: 'LT',
    aliases: ['lt', 'lithuania', '立陶宛', 'LT'],
  },
  '🇪🇪': {
    en: 'Estonia',
    zh: '爱沙尼亞',
    code: 'EE',
    aliases: ['ee', 'estonia', '爱沙尼亚', '愛沙尼亞', 'EE'],
  },
  '🇲🇽': {
    en: 'Mexico',
    zh: '墨西哥',
    code: 'MX',
    aliases: ['mx', 'mexico', '墨西哥', 'MX'],
  },
  '🇦🇷': {
    en: 'Argentina',
    zh: '阿根廷',
    code: 'AR',
    aliases: ['ar', 'argentina', '阿根廷', 'AR'],
  },
  '🇨🇱': {
    en: 'Chile',
    zh: '智利',
    code: 'CL',
    aliases: ['cl', 'chile', '智利', 'CL'],
  },
  '🇨🇴': {
    en: 'Colombia',
    zh: '哥倫比亞',
    code: 'CO',
    aliases: ['co', 'colombia', '哥伦比亚', '哥倫比亞', 'CO'],
  },
  '🇵🇪': {
    en: 'Peru',
    zh: '秘鲁',
    code: 'PE',
    aliases: ['pe', 'peru', '秘鲁', '秘魯', 'PE'],
  },
  '🇻🇪': {
    en: 'Venezuela',
    zh: '委内瑞拉',
    code: 'VE',
    aliases: ['ve', 'venezuela', '委内瑞拉', '委內瑞拉', 'VE'],
  },
  '🇺🇾': {
    en: 'Uruguay',
    zh: '烏拉圭',
    code: 'UY',
    aliases: ['uy', 'uruguay', '乌拉圭', '烏拉圭', 'UY'],
  },
  '🇪🇨': {
    en: 'Ecuador',
    zh: '厄瓜多',
    code: 'EC',
    aliases: ['ec', 'ecuador', '厄瓜多尔', '厄瓜多', 'EC'],
  },
  '🇧🇴': {
    en: 'Bolivia',
    zh: '玻利維亞',
    code: 'BO',
    aliases: ['bo', 'bolivia', '玻利维亚', '玻利維亞', 'BO'],
  },
  '🇵🇾': {
    en: 'Paraguay',
    zh: '巴拉圭',
    code: 'PY',
    aliases: ['py', 'paraguay', '巴拉圭', 'PY'],
  },
  '🇬🇾': {
    en: 'Guyana',
    zh: '圭亞那',
    code: 'GY',
    aliases: ['gy', 'guyana', '圭亚那', '圭亞那', 'GY'],
  },
  '🇸🇷': {
    en: 'Suriname',
    zh: '蘇利南',
    code: 'SR',
    aliases: ['sr', 'suriname', '苏里南', '蘇利南', 'SR'],
  },
  '🇫🇰': {
    en: 'Falkland Islands',
    zh: '福克蘭群島',
    code: 'FK',
    aliases: ['fk', 'falkland', '福克兰', '福克蘭', 'FK'],
  },
  '🇬🇫': {
    en: 'French Guiana',
    zh: '法屬圭亞那',
    code: 'GF',
    aliases: ['gf', 'french guiana', '法属圭亚那', '法屬圭亞那', 'GF'],
  },
  '🇵🇦': {
    en: 'Panama',
    zh: '巴拿馬',
    code: 'PA',
    aliases: ['pa', 'panama', '巴拿马', '巴拿馬', 'PA'],
  },
  '🇨🇷': {
    en: 'Costa Rica',
    zh: '哥斯大黎加',
    code: 'CR',
    aliases: ['cr', 'costa rica', '哥斯达黎加', '哥斯大黎加', 'CR'],
  },
  '🇳🇮': {
    en: 'Nicaragua',
    zh: '尼加拉瓜',
    code: 'NI',
    aliases: ['ni', 'nicaragua', '尼加拉瓜', 'NI'],
  },
  '🇭🇳': {
    en: 'Honduras',
    zh: '洪都拉斯',
    code: 'HN',
    aliases: ['hn', 'honduras', '洪都拉斯', 'HN'],
  },
  '🇬🇹': {
    en: 'Guatemala',
    zh: '瓜地馬拉',
    code: 'GT',
    aliases: ['gt', 'guatemala', '危地马拉', '瓜地馬拉', 'GT'],
  },
  '🇧🇿': {
    en: 'Belize',
    zh: '貝里斯',
    code: 'BZ',
    aliases: ['bz', 'belize', '伯利兹', '貝里斯', 'BZ'],
  },
  '🇸🇻': {
    en: 'El Salvador',
    zh: '薩爾瓦多',
    code: 'SV',
    aliases: ['sv', 'el salvador', '萨尔瓦多', '薩爾瓦多', 'SV'],
  },
  '🇯🇲': {
    en: 'Jamaica',
    zh: '牙買加',
    code: 'JM',
    aliases: ['jm', 'jamaica', '牙买加', '牙買加', 'JM'],
  },
  '🇨🇺': {
    en: 'Cuba',
    zh: '古巴',
    code: 'CU',
    aliases: ['cu', 'cuba', '古巴', 'CU'],
  },
  '🇩🇴': {
    en: 'Dominican Republic',
    zh: '多明尼加',
    code: 'DO',
    aliases: ['do', 'dominican', '多明尼加', 'DO'],
  },
  '🇭🇹': {
    en: 'Haiti',
    zh: '海地',
    code: 'HT',
    aliases: ['ht', 'haiti', '海地', 'HT'],
  },
  '🇧🇸': {
    en: 'Bahamas',
    zh: '巴哈馬',
    code: 'BS',
    aliases: ['bs', 'bahamas', '巴哈马', '巴哈馬', 'BS'],
  },
  '🇧🇧': {
    en: 'Barbados',
    zh: '巴貝多',
    code: 'BB',
    aliases: ['bb', 'barbados', '巴貝多', 'BB'],
  },
  '🇹🇹': {
    en: 'Trinidad and Tobago',
    zh: '千里達及托巴哥',
    code: 'TT',
    aliases: ['tt', 'trinidad', '特立尼达', '千里達及托巴哥', 'TT'],
  },
  '🇵🇭': {
    en: 'Philippines',
    zh: '菲律賓',
    code: 'PH',
    aliases: ['ph', 'philippines', '菲律宾', '菲律賓', 'PH'],
  },
  '🇹🇭': {
    en: 'Thailand',
    zh: '泰國',
    code: 'TH',
    aliases: ['th', 'thailand', '泰国', '泰國', 'TH'],
  },
  '🇻🇳': {
    en: 'Vietnam',
    zh: '越南',
    code: 'VN',
    aliases: ['vn', 'vietnam', '越南', 'VN'],
  },
  '🇲🇾': {
    en: 'Malaysia',
    zh: '馬來西亞',
    code: 'MY',
    aliases: ['my', 'malaysia', '马来西亚', '馬來西亞', 'MY'],
  },
  '🇮🇩': {
    en: 'Indonesia',
    zh: '印尼',
    code: 'ID',
    aliases: ['id', 'indonesia', '印度尼西亚', '印尼', 'ID'],
  },
  '🇱🇦': {
    en: 'Laos',
    zh: '寮國',
    code: 'LA',
    aliases: ['la', 'laos', '老挝', '寮國', 'LA'],
  },
  '🇰🇭': {
    en: 'Cambodia',
    zh: '柬埔寨',
    code: 'KH',
    aliases: ['kh', 'cambodia', '柬埔寨', 'KH'],
  },
  '🇲🇲': {
    en: 'Myanmar',
    zh: '緬甸',
    code: 'MM',
    aliases: ['mm', 'myanmar', 'burma', '缅甸', '緬甸', 'MM'],
  },
  '🇧🇳': {
    en: 'Brunei',
    zh: '汶萊',
    code: 'BN',
    aliases: ['bn', 'brunei', '文莱', '汶萊', 'BN'],
  },
  '🇪🇬': {
    en: 'Egypt',
    zh: '埃及',
    code: 'EG',
    aliases: ['eg', 'egypt', '埃及', 'EG'],
  },
  '🇿🇦': {
    en: 'South Africa',
    zh: '南非',
    code: 'ZA',
    aliases: ['za', 'south africa', '南非', 'ZA'],
  },
  '🇳🇬': {
    en: 'Nigeria',
    zh: '奈及利亞',
    code: 'NG',
    aliases: ['ng', 'nigeria', '尼日利亚', '奈及利亞', 'NG'],
  },
  '🇰🇪': {
    en: 'Kenya',
    zh: '肯亞',
    code: 'KE',
    aliases: ['ke', 'kenya', '肯尼亚', '肯亞', 'KE'],
  },
  '🇪🇹': {
    en: 'Ethiopia',
    zh: '衣索比亞',
    code: 'ET',
    aliases: ['et', 'ethiopia', '埃塞俄比亚', '衣索比亞', 'ET'],
  },
  '🇬🇭': {
    en: 'Ghana',
    zh: '迦納',
    code: 'GH',
    aliases: ['gh', 'ghana', '加纳', '迦納', 'GH'],
  },
  '🇺🇬': {
    en: 'Uganda',
    zh: '烏干達',
    code: 'UG',
    aliases: ['ug', 'uganda', '乌干达', '烏干達', 'UG'],
  },
  '🇹🇿': {
    en: 'Tanzania',
    zh: '坦尚尼亞',
    code: 'TZ',
    aliases: ['tz', 'tanzania', '坦桑尼亚', '坦尚尼亞', 'TZ'],
  },
  '🇷🇼': {
    en: 'Rwanda',
    zh: '盧安達',
    code: 'RW',
    aliases: ['rw', 'rwanda', '卢旺达', '盧安達', 'RW'],
  },
  '🇿🇼': {
    en: 'Zimbabwe',
    zh: '辛巴威',
    code: 'ZW',
    aliases: ['zw', 'zimbabwe', '津巴布韦', '辛巴威', 'ZW'],
  },
  '🇿🇲': {
    en: 'Zambia',
    zh: '尚比亞',
    code: 'ZM',
    aliases: ['zm', 'zambia', '赞比亚', '尚比亞', 'ZM'],
  },
  '🇧🇼': {
    en: 'Botswana',
    zh: '波札那',
    code: 'BW',
    aliases: ['bw', 'botswana', '博茨瓦纳', '波札那', 'BW'],
  },
  '🇳🇦': {
    en: 'Namibia',
    zh: '納米比亞',
    code: 'NA',
    aliases: ['na', 'namibia', '纳米比亚', '納米比亞', 'NA'],
  },
  '🇲🇦': {
    en: 'Morocco',
    zh: '摩洛哥',
    code: 'MA',
    aliases: ['ma', 'morocco', '摩洛哥', 'MA'],
  },
  '🇩🇿': {
    en: 'Algeria',
    zh: '阿爾及利亞',
    code: 'DZ',
    aliases: ['dz', 'algeria', '阿尔及利亚', '阿爾及利亞', 'DZ'],
  },
  '🇹🇳': {
    en: 'Tunisia',
    zh: '突尼西亞',
    code: 'TN',
    aliases: ['tn', 'tunisia', '突尼西亞', 'TN'],
  },
  '🇱🇾': {
    en: 'Libya',
    zh: '利比亞',
    code: 'LY',
    aliases: ['ly', 'libya', '利比亚', '利比亞', 'LY'],
  },
  '🇸🇩': {
    en: 'Sudan',
    zh: '蘇丹',
    code: 'SD',
    aliases: ['sd', 'sudan', '苏丹', '蘇丹', 'SD'],
  },
  '🇸🇸': {
    en: 'South Sudan',
    zh: '南蘇丹',
    code: 'SS',
    aliases: ['ss', 'south sudan', '南苏丹', '南蘇丹', 'SS'],
  },
  '🇨🇩': {
    en: 'Democratic Republic of Congo',
    zh: '剛果民主共和國',
    code: 'CD',
    aliases: ['cd', 'congo', 'drc', '刚果', '剛果', 'CD'],
  },
  '🇨🇬': {
    en: 'Republic of Congo',
    zh: '剛果共和國',
    code: 'CG',
    aliases: ['cg', 'congo', '刚果', '剛果', 'CG'],
  },
  '🇨🇫': {
    en: 'Central African Republic',
    zh: '中非共和國',
    code: 'CF',
    aliases: ['cf', 'central african', '中非', 'CF'],
  },
  '🇨🇲': {
    en: 'Cameroon',
    zh: '喀麥隆',
    code: 'CM',
    aliases: ['cm', 'cameroon', '喀麦隆', '喀麥隆', 'CM'],
  },
  '🇹🇩': {
    en: 'Chad',
    zh: '查德',
    code: 'TD',
    aliases: ['td', 'chad', '查德', 'TD'],
  },
  '🇳🇪': {
    en: 'Niger',
    zh: '尼日',
    code: 'NE',
    aliases: ['ne', 'niger', '尼日尔', '尼日', 'NE'],
  },
  '🇲🇱': {
    en: 'Mali',
    zh: '馬利',
    code: 'ML',
    aliases: ['ml', 'mali', '马里', '馬利', 'ML'],
  },
  '🇧🇫': {
    en: 'Burkina Faso',
    zh: '布吉納法索',
    code: 'BF',
    aliases: ['bf', 'burkina', '布基纳法索', '布吉納法索', 'BF'],
  },
  '🇸🇳': {
    en: 'Senegal',
    zh: '塞內加爾',
    code: 'SN',
    aliases: ['sn', 'senegal', '塞内加尔', '塞內加爾', 'SN'],
  },
  '🇬🇲': {
    en: 'Gambia',
    zh: '甘比亞',
    code: 'GM',
    aliases: ['gm', 'gambia', '冈比亚', '甘比亞', 'GM'],
  },
  '🇬🇼': {
    en: 'Guinea-Bissau',
    zh: '幾內亞比索',
    code: 'GW',
    aliases: ['gw', 'guinea-bissau', '几内亚比绍', '幾內亞比索', 'GW'],
  },
  '🇬🇳': {
    en: 'Guinea',
    zh: '幾內亞',
    code: 'GN',
    aliases: ['gn', 'guinea', '几内亚', '幾內亞', 'GN'],
  },
  '🇸🇱': {
    en: 'Sierra Leone',
    zh: '獅子山',
    code: 'SL',
    aliases: ['sl', 'sierra leone', '獅子山', 'SL'],
  },
  '🇱🇷': {
    en: 'Liberia',
    zh: '賴比瑞亞',
    code: 'LR',
    aliases: ['lr', 'liberia', '利比里亚', '賴比瑞亞', 'LR'],
  },
  '🇨🇮': {
    en: 'Ivory Coast',
    zh: '象牙海岸',
    code: 'CI',
    aliases: ['ci', 'ivory coast', '科特迪瓦', '象牙海岸', 'CI'],
  },
  '🇹🇬': {
    en: 'Togo',
    zh: '多哥',
    code: 'TG',
    aliases: ['tg', 'togo', '多哥', 'TG'],
  },
  '🇧🇯': {
    en: 'Benin',
    zh: '貝南',
    code: 'BJ',
    aliases: ['bj', 'benin', '贝宁', '貝南', 'BJ'],
  },
  '🇦🇨': {
    en: 'AC',
    zh: '阿瑟森島',
    code: 'AC',
    aliases: ['ac', 'AC'],
  },
  '🇦🇩': {
    en: 'AD',
    zh: '安道爾',
    code: 'AD',
    aliases: ['ad', 'AD'],
  },
  '🇦🇪': {
    en: 'United Arab Emirates',
    zh: '阿拉伯聯合大公國',
    code: 'AE',
    aliases: ['ae', 'AE', 'united arab emirates', '阿联酋'],
  },
  '🇦🇫': {
    en: 'Afghanistan',
    zh: '阿富汗',
    code: 'AF',
    aliases: ['af', 'AF', 'afghanistan', '阿富汗'],
  },
  '🇦🇬': {
    en: 'Antigua and Barbuda',
    zh: '安地卡及巴布達',
    code: 'AG',
    aliases: ['ag', 'AG', 'antigua and barbuda', '安地卡及巴布達'],
  },
  '🇦🇮': {
    en: 'Anguilla',
    zh: '安吉拉',
    code: 'AI',
    aliases: ['ai', 'AI', 'anguilla', '安圭拉'],
  },
  '🇦🇱': {
    en: 'Albania',
    zh: '阿爾巴尼亞',
    code: 'AL',
    aliases: ['al', 'AL', 'albania', '阿爾巴尼亞'],
  },
  '🇦🇲': {
    en: 'Armenia',
    zh: '亞美尼亞',
    code: 'AM',
    aliases: ['am', 'AM', 'armenia', '亞美尼亞'],
  },
  '🇦🇴': {
    en: 'Angola',
    zh: '安哥拉',
    code: 'AO',
    aliases: ['ao', 'AO', 'angola', '安哥拉'],
  },
  '🇦🇶': {
    en: 'Antarctica',
    zh: '南極',
    code: 'AQ',
    aliases: ['aq', 'AQ', 'antarctica', '南極'],
  },
  '🇦🇸': {
    en: 'American Samoa',
    zh: '美屬薩摩亞',
    code: 'AS',
    aliases: ['as', 'AS', 'american samoa', '美屬薩摩亞'],
  },
  '🇦🇼': {
    en: 'Aruba',
    zh: '阿魯巴',
    code: 'AW',
    aliases: ['aw', 'AW', 'aruba', '阿魯巴'],
  },
  '🇦🇽': {
    en: 'Åland Islands',
    zh: '奧蘭',
    code: 'AX',
    aliases: ['ax', 'AX', 'åland islands', '奧蘭群島'],
  },
  '🇦🇿': {
    en: 'Azerbaijan',
    zh: '亞塞拜然',
    code: 'AZ',
    aliases: ['az', 'AZ', 'azerbaijan', '亞塞拜然'],
  },
  '🇧🇦': {
    en: 'Bosnia and Herzegovina',
    zh: '波士尼亞與赫塞哥維納',
    code: 'BA',
    aliases: ['ba', 'BA', 'bosnia and herzegovina', '波士尼亞與赫塞哥維納'],
  },
  '🇧🇩': {
    en: 'Bangladesh',
    zh: '孟加拉',
    code: 'BD',
    aliases: ['bd', 'BD', 'bangladesh', '孟加拉'],
  },
  '🇧🇭': {
    en: 'Bahrain',
    zh: '巴林',
    code: 'BH',
    aliases: ['bh', 'BH', 'bahrain', '巴林'],
  },
  '🇧🇮': {
    en: 'Burundi',
    zh: '蒲隆地',
    code: 'BI',
    aliases: ['bi', 'BI', 'burundi', '蒲隆地'],
  },
  '🇧🇱': {
    en: 'Saint Barthélemy',
    zh: '聖巴瑟米',
    code: 'BL',
    aliases: ['bl', 'BL', 'saint barthélemy', '聖巴瑟米'],
  },
  '🇧🇲': {
    en: 'Bermuda',
    zh: '百慕達',
    code: 'BM',
    aliases: ['bm', 'BM', 'bermuda', '百慕達'],
  },
  '🇧🇶': {
    en: 'Caribbean Netherlands',
    zh: '荷屬加勒比',
    code: 'BQ',
    aliases: ['bq', 'BQ', 'caribbean netherlands', '荷屬加勒比'],
  },
  '🇧🇹': {
    en: 'Bhutan',
    zh: '不丹',
    code: 'BT',
    aliases: ['bt', 'BT', 'bhutan', '不丹'],
  },
  '🇧🇻': {
    en: 'Bouvet Island',
    zh: '布威島',
    code: 'BV',
    aliases: ['bv', 'BV', 'bouvet island', '布威島'],
  },
  '🇧🇾': {
    en: 'Belarus',
    zh: '白俄羅斯',
    code: 'BY',
    aliases: ['by', 'BY', 'belarus', '白俄羅斯'],
  },
  '🇨🇨': {
    en: 'Cocos Islands',
    zh: '科科斯群島',
    code: 'CC',
    aliases: ['cc', 'CC', 'cocos islands', '科科斯群島'],
  },
  '🇨🇰': {
    en: 'Cook Islands',
    zh: '庫克群島',
    code: 'CK',
    aliases: ['ck', 'CK', 'cook islands', '庫克群島'],
  },
  '🇨🇵': {
    en: 'Clipperton Island',
    zh: '克利珀頓島',
    code: 'CP',
    aliases: ['cp', 'CP', 'clipperton island', '克利珀頓島'],
  },
  '🇨🇻': {
    en: 'Cape Verde',
    zh: '維德角',
    code: 'CV',
    aliases: ['cv', 'CV', 'cape verde', '維德角'],
  },
  '🇨🇼': {
    en: 'Curaçao',
    zh: '古拉索',
    code: 'CW',
    aliases: ['cw', 'CW', 'curaçao', '古拉索'],
  },
  '🇨🇽': {
    en: 'Christmas Island',
    zh: '聖誕島',
    code: 'CX',
    aliases: ['cx', 'CX', 'christmas island', '聖誕島'],
  },
  '🇨🇾': {
    en: 'Cyprus',
    zh: '賽普勒斯',
    code: 'CY',
    aliases: ['cy', 'CY', 'cyprus', '賽普勒斯'],
  },
  '🇩🇬': {
    en: 'Diego Garcia',
    zh: '迪亞哥加西亞島',
    code: 'DG',
    aliases: ['dg', 'DG', 'diego garcia', '迪亞哥加西亞島'],
  },
  '🇩🇯': {
    en: 'Djibouti',
    zh: '吉布地',
    code: 'DJ',
    aliases: ['dj', 'DJ', 'djibouti', '吉布地'],
  },
  '🇩🇰': {
    en: 'Denmark',
    zh: '丹麥',
    code: 'DK',
    aliases: ['dk', 'DK', 'denmark', '丹麥'],
  },
  '🇩🇲': {
    en: 'Dominica',
    zh: '多米尼克',
    code: 'DM',
    aliases: ['dm', 'DM', 'dominica', '多米尼克'],
  },
  '🇪🇦': {
    en: 'Ceuta and Melilla',
    zh: '梅利利亞',
    code: 'EA',
    aliases: ['ea', 'EA', 'ceuta and melilla', '梅利利亞'],
  },
  '🇪🇭': {
    en: 'Western Sahara',
    zh: '西撒哈拉',
    code: 'EH',
    aliases: ['eh', 'EH', 'western sahara', '西撒哈拉'],
  },
  '🇪🇷': {
    en: 'Eritrea',
    zh: '厄利垂亞',
    code: 'ER',
    aliases: ['er', 'ER', 'eritrea', '厄利垂亞'],
  },
  '🇪🇺': {
    en: 'European Union',
    zh: '歐盟',
    code: 'EU',
    aliases: ['eu', 'EU', 'european union', '歐盟'],
  },
  '🇫🇯': {
    en: 'Fiji',
    zh: '斐濟',
    code: 'FJ',
    aliases: ['fj', 'FJ', 'fiji', '斐濟'],
  },
  '🇫🇲': {
    en: 'Micronesia',
    zh: '密克羅尼西亞',
    code: 'FM',
    aliases: ['fm', 'FM', 'micronesia', '密克羅尼西亞'],
  },
  '🇫🇴': {
    en: 'Faroe Islands',
    zh: '法羅群島',
    code: 'FO',
    aliases: ['fo', 'FO', 'faroe islands', '法羅群島'],
  },
  '🇬🇦': {
    en: 'Gabon',
    zh: '加彭',
    code: 'GA',
    aliases: ['ga', 'GA', 'gabon', '加彭'],
  },
  '🇬🇩': {
    en: 'Grenada',
    zh: '格瑞那達',
    code: 'GD',
    aliases: ['gd', 'GD', 'grenada', '格瑞那達'],
  },
  '🇬🇪': {
    en: 'Georgia',
    zh: '喬治亞',
    code: 'GE',
    aliases: ['ge', 'GE', 'georgia', '喬治亞'],
  },
  '🇬🇬': {
    en: 'Guernsey',
    zh: '根西',
    code: 'GG',
    aliases: ['gg', 'GG', 'guernsey', '根西'],
  },
  '🇬🇮': {
    en: 'Gibraltar',
    zh: '直布羅陀',
    code: 'GI',
    aliases: ['gi', 'GI', 'gibraltar', '直布羅陀'],
  },
  '🇬🇱': {
    en: 'Greenland',
    zh: '格陵蘭',
    code: 'GL',
    aliases: ['gl', 'GL', 'greenland', '格陵蘭'],
  },
  '🇬🇵': {
    en: 'Guadeloupe',
    zh: '瓜德羅普',
    code: 'GP',
    aliases: ['gp', 'GP', 'guadeloupe', '瓜德羅普'],
  },
  '🇬🇶': {
    en: 'Equatorial Guinea',
    zh: '赤道幾內亞',
    code: 'GQ',
    aliases: ['gq', 'GQ', 'equatorial guinea', '赤道幾內亞'],
  },
  '🇬🇸': {
    en: 'South Georgia',
    zh: '南喬治亞',
    code: 'GS',
    aliases: ['gs', 'GS', 'south georgia', '南喬治亞'],
  },
  '🇬🇺': {
    en: 'Guam',
    zh: '關島',
    code: 'GU',
    aliases: ['gu', 'GU', 'guam', '關島'],
  },
  '🇭🇲': {
    en: 'Heard Island',
    zh: '赫德島',
    code: 'HM',
    aliases: ['hm', 'HM', 'heard island', '赫德島'],
  },
  '🇮🇨': {
    en: 'Canary Islands',
    zh: '加納利群島',
    code: 'IC',
    aliases: ['ic', 'IC', 'canary islands', '加納利群島'],
  },
  '🇮🇪': {
    en: 'Ireland',
    zh: '愛爾蘭',
    code: 'IE',
    aliases: ['ie', 'IE', 'ireland', '愛爾蘭'],
  },
  '🇮🇱': {
    en: 'Israel',
    zh: '以色列',
    code: 'IL',
    aliases: ['il', 'IL', 'israel', '以色列'],
  },
  '🇮🇲': {
    en: 'Isle of Man',
    zh: '曼島',
    code: 'IM',
    aliases: ['im', 'IM', 'isle of man', '曼島'],
  },
  '🇮🇴': {
    en: 'British Indian Ocean Territory',
    zh: '英屬印度洋領地',
    code: 'IO',
    aliases: ['io', 'IO', 'british indian ocean territory', '英屬印度洋領地'],
  },
  '🇮🇶': {
    en: 'Iraq',
    zh: '伊拉克',
    code: 'IQ',
    aliases: ['iq', 'IQ', 'iraq', '伊拉克'],
  },
  '🇮🇷': {
    en: 'Iran',
    zh: '伊朗',
    code: 'IR',
    aliases: ['ir', 'IR', 'iran', '伊朗'],
  },
  '🇮🇸': {
    en: 'Iceland',
    zh: '冰島',
    code: 'IS',
    aliases: ['is', 'IS', 'iceland', '冰島'],
  },
  '🇯🇪': {
    en: 'Jersey',
    zh: '澤西',
    code: 'JE',
    aliases: ['je', 'JE', 'jersey', '澤西'],
  },
  '🇯🇴': {
    en: 'Jordan',
    zh: '約旦',
    code: 'JO',
    aliases: ['jo', 'JO', 'jordan', '約旦'],
  },
  '🇰🇬': {
    en: 'Kyrgyzstan',
    zh: '吉爾吉斯',
    code: 'KG',
    aliases: ['kg', 'KG', 'kyrgyzstan', '吉爾吉斯'],
  },
  '🇰🇮': {
    en: 'Kiribati',
    zh: '吉里巴斯',
    code: 'KI',
    aliases: ['ki', 'KI', 'kiribati', '吉里巴斯'],
  },
  '🇰🇲': {
    en: 'Comoros',
    zh: '葛摩',
    code: 'KM',
    aliases: ['km', 'KM', 'comoros', '葛摩'],
  },
  '🇰🇳': {
    en: 'Saint Kitts and Nevis',
    zh: '聖克里斯多福及尼維斯',
    code: 'KN',
    aliases: ['kn', 'KN', 'saint kitts and nevis', '聖克里斯多福及尼維斯'],
  },
  '🇰🇵': {
    en: 'North Korea',
    zh: '北韓',
    code: 'KP',
    aliases: ['kp', 'KP', 'north korea', '北韓'],
  },
  '🇰🇼': {
    en: 'Kuwait',
    zh: '科威特',
    code: 'KW',
    aliases: ['kw', 'KW', 'kuwait', '科威特'],
  },
  '🇰🇾': {
    en: 'Cayman Islands',
    zh: '開曼群島',
    code: 'KY',
    aliases: ['ky', 'KY', 'cayman islands', '開曼群島'],
  },
  '🇰🇿': {
    en: 'Kazakhstan',
    zh: '哈薩克',
    code: 'KZ',
    aliases: ['kz', 'KZ', 'kazakhstan', '哈薩克'],
  },
  '🇱🇧': {
    en: 'Lebanon',
    zh: '黎巴嫩',
    code: 'LB',
    aliases: ['lb', 'LB', 'lebanon', '黎巴嫩'],
  },
  '🇱🇨': {
    en: 'Saint Lucia',
    zh: '聖露西亞',
    code: 'LC',
    aliases: ['lc', 'LC', 'saint lucia', '聖露西亞'],
  },
  '🇱🇮': {
    en: 'Liechtenstein',
    zh: '列支敦士登',
    code: 'LI',
    aliases: ['li', 'LI', 'liechtenstein', '列支敦士登'],
  },
  '🇱🇰': {
    en: 'Sri Lanka',
    zh: '斯里蘭卡',
    code: 'LK',
    aliases: ['lk', 'LK', 'sri lanka', '斯里蘭卡'],
  },
  '🇱🇸': {
    en: 'Lesotho',
    zh: '賴索托',
    code: 'LS',
    aliases: ['ls', 'LS', 'lesotho', '賴索托'],
  },
  '🇱🇺': {
    en: 'Luxembourg',
    zh: '盧森堡',
    code: 'LU',
    aliases: ['lu', 'LU', 'luxembourg', '盧森堡'],
  },
  '🇲🇨': {
    en: 'Monaco',
    zh: '摩納哥',
    code: 'MC',
    aliases: ['mc', 'MC', 'monaco', '摩納哥'],
  },
  '🇲🇩': {
    en: 'Moldova',
    zh: '摩爾多瓦',
    code: 'MD',
    aliases: ['md', 'MD', 'moldova', '摩爾多瓦'],
  },
  '🇲🇪': {
    en: 'Montenegro',
    zh: '蒙特內哥羅',
    code: 'ME',
    aliases: ['me', 'ME', 'montenegro', '蒙特內哥羅'],
  },
  '🇲🇫': {
    en: 'Saint Martin',
    zh: '法屬聖馬丁',
    code: 'MF',
    aliases: ['mf', 'MF', 'saint martin', '法屬聖馬丁'],
  },
  '🇲🇬': {
    en: 'Madagascar',
    zh: '馬達加斯加',
    code: 'MG',
    aliases: ['mg', 'MG', 'madagascar', '馬達加斯加'],
  },
  '🇲🇭': {
    en: 'Marshall Islands',
    zh: '馬紹爾群島',
    code: 'MH',
    aliases: ['mh', 'MH', 'marshall islands', '馬紹爾群島'],
  },
  '🇲🇰': {
    en: 'North Macedonia',
    zh: '馬其頓',
    code: 'MK',
    aliases: ['mk', 'MK', 'north macedonia', '馬其頓'],
  },
  '🇲🇳': {
    en: 'Mongolia',
    zh: '蒙古',
    code: 'MN',
    aliases: ['mn', 'MN', 'mongolia', '蒙古'],
  },
  '🇲🇴': {
    en: 'Macau',
    zh: '澳門',
    code: 'MO',
    aliases: ['mo', 'MO', 'macau', '澳門'],
  },
  '🇲🇵': {
    en: 'Northern Mariana Islands',
    zh: '北馬利安納群島',
    code: 'MP',
    aliases: ['mp', 'MP', 'northern mariana islands', '北馬利安納群島'],
  },
  '🇲🇶': {
    en: 'Martinique',
    zh: '馬提尼克',
    code: 'MQ',
    aliases: ['mq', 'MQ', 'martinique', '馬提尼克'],
  },
  '🇲🇷': {
    en: 'Mauritania',
    zh: '茅利塔尼亞',
    code: 'MR',
    aliases: ['mr', 'MR', 'mauritania', '茅利塔尼亞'],
  },
  '🇲🇸': {
    en: 'Montserrat',
    zh: '蒙哲臘',
    code: 'MS',
    aliases: ['ms', 'MS', 'montserrat', '蒙哲臘'],
  },
  '🇲🇹': {
    en: 'Malta',
    zh: '馬爾他',
    code: 'MT',
    aliases: ['mt', 'MT', 'malta', '馬爾他'],
  },
  '🇲🇺': {
    en: 'Mauritius',
    zh: '模里西斯',
    code: 'MU',
    aliases: ['mu', 'MU', 'mauritius', '模里西斯'],
  },
  '🇲🇻': {
    en: 'Maldives',
    zh: '馬爾地夫',
    code: 'MV',
    aliases: ['mv', 'MV', 'maldives', '馬爾地夫'],
  },
  '🇲🇼': {
    en: 'Malawi',
    zh: '馬拉威',
    code: 'MW',
    aliases: ['mw', 'MW', 'malawi', '馬拉威'],
  },
  '🇲🇿': {
    en: 'Mozambique',
    zh: '莫三比克',
    code: 'MZ',
    aliases: ['mz', 'MZ', 'mozambique', '莫三比克'],
  },
  '🇳🇨': {
    en: 'New Caledonia',
    zh: '新喀里多尼亞',
    code: 'NC',
    aliases: ['nc', 'NC', 'new caledonia', '新喀里多尼亞'],
  },
  '🇳🇫': {
    en: 'Norfolk Island',
    zh: '諾福克島',
    code: 'NF',
    aliases: ['nf', 'NF', 'norfolk island', '諾福克島'],
  },
  '🇳🇵': {
    en: 'Nepal',
    zh: '尼泊爾',
    code: 'NP',
    aliases: ['np', 'NP', 'nepal', '尼泊爾'],
  },
  '🇳🇷': {
    en: 'Nauru',
    zh: '諾魯',
    code: 'NR',
    aliases: ['nr', 'NR', 'nauru', '諾魯'],
  },
  '🇳🇺': {
    en: 'Niue',
    zh: '紐埃',
    code: 'NU',
    aliases: ['nu', 'NU', 'niue', '紐埃'],
  },
  '🇳🇿': {
    en: 'New Zealand',
    zh: '紐西蘭',
    code: 'NZ',
    aliases: ['nz', 'NZ', 'new zealand', '紐西蘭'],
  },
  '🇴🇲': {
    en: 'Oman',
    zh: '阿曼',
    code: 'OM',
    aliases: ['om', 'OM', 'oman', '阿曼'],
  },
  '🇵🇫': {
    en: 'French Polynesia',
    zh: '法屬玻里尼西亞',
    code: 'PF',
    aliases: ['pf', 'PF', 'french polynesia', '法屬玻里尼西亞'],
  },
  '🇵🇬': {
    en: 'Papua New Guinea',
    zh: '巴布亞紐幾內亞',
    code: 'PG',
    aliases: ['pg', 'PG', 'papua new guinea', '巴布亞紐幾內亞'],
  },
  '🇵🇰': {
    en: 'Pakistan',
    zh: '巴基斯坦',
    code: 'PK',
    aliases: ['pk', 'PK', 'pakistan', '巴基斯坦'],
  },
  '🇵🇲': {
    en: 'Saint Pierre and Miquelon',
    zh: '聖皮埃爾與密克隆',
    code: 'PM',
    aliases: ['pm', 'PM', 'saint pierre and miquelon', '聖皮埃爾與密克隆'],
  },
  '🇵🇳': {
    en: 'Pitcairn Islands',
    zh: '皮特肯群島',
    code: 'PN',
    aliases: ['pn', 'PN', 'pitcairn islands', '皮特肯群島'],
  },
  '🇵🇷': {
    en: 'Puerto Rico',
    zh: '波多黎各',
    code: 'PR',
    aliases: ['pr', 'PR', 'puerto rico', '波多黎各'],
  },
  '🇵🇸': {
    en: 'Palestine',
    zh: '巴勒斯坦',
    code: 'PS',
    aliases: ['ps', 'PS', 'palestine', '巴勒斯坦'],
  },
  '🇵🇼': {
    en: 'Palau',
    zh: '帛琉',
    code: 'PW',
    aliases: ['pw', 'PW', 'palau', '帛琉'],
  },
  '🇶🇦': {
    en: 'Qatar',
    zh: '卡達',
    code: 'QA',
    aliases: ['qa', 'QA', 'qatar', '卡達'],
  },
  '🇷🇪': {
    en: 'Réunion',
    zh: '留尼旺',
    code: 'RE',
    aliases: ['re', 'RE', 'réunion', '留尼旺'],
  },
  '🇷🇸': {
    en: 'Serbia',
    zh: '塞爾維亞',
    code: 'RS',
    aliases: ['rs', 'RS', 'serbia', '塞爾維亞'],
  },
  '🇸🇦': {
    en: 'Saudi Arabia',
    zh: '沙烏地阿拉伯',
    code: 'SA',
    aliases: ['sa', 'SA', 'saudi arabia', '沙烏地阿拉伯'],
  },
  '🇸🇧': {
    en: 'Solomon Islands',
    zh: '索羅門群島',
    code: 'SB',
    aliases: ['sb', 'SB', 'solomon islands', '索羅門群島'],
  },
  '🇸🇨': {
    en: 'Seychelles',
    zh: '塞席爾',
    code: 'SC',
    aliases: ['sc', 'SC', 'seychelles', '塞席爾'],
  },
  '🇸🇭': {
    en: 'Saint Helena',
    zh: '聖赫勒拿',
    code: 'SH',
    aliases: ['sh', 'SH', 'saint helena', '聖赫勒拿'],
  },
  '🇸🇯': {
    en: 'Svalbard and Jan Mayen',
    zh: '斯瓦巴與揚馬延',
    code: 'SJ',
    aliases: ['sj', 'SJ', 'svalbard and jan mayen', '斯瓦巴與揚馬延'],
  },
  '🇸🇲': {
    en: 'San Marino',
    zh: '聖馬利諾',
    code: 'SM',
    aliases: ['sm', 'SM', 'san marino', '聖馬利諾'],
  },
  '🇸🇴': {
    en: 'Somalia',
    zh: '索馬利亞',
    code: 'SO',
    aliases: ['so', 'SO', 'somalia', '索馬利亞'],
  },
  '🇸🇹': {
    en: 'São Tomé and Príncipe',
    zh: '聖多美與普林西比',
    code: 'ST',
    aliases: ['st', 'ST', 'são tomé and príncipe', '聖多美和普林西比'],
  },
  '🇸🇽': {
    en: 'Sint Maarten',
    zh: '荷屬聖馬丁',
    code: 'SX',
    aliases: ['sx', 'SX', 'sint maarten', '荷屬聖馬丁'],
  },
  '🇸🇾': {
    en: 'Syria',
    zh: '敘利亞',
    code: 'SY',
    aliases: ['sy', 'SY', 'syria', '敘利亞'],
  },
  '🇸🇿': {
    en: 'Eswatini',
    zh: '史瓦帝尼',
    code: 'SZ',
    aliases: ['sz', 'SZ', 'eswatini', '史瓦帝尼'],
  },
  '🇹🇦': {
    en: 'Tristan da Cunha',
    zh: '崔斯坦達庫尼亞',
    code: 'TA',
    aliases: ['ta', 'TA', 'tristan da cunha', '崔斯坦達庫尼亞'],
  },
  '🇹🇨': {
    en: 'Turks and Caicos Islands',
    zh: '土克斯及凱科斯群島',
    code: 'TC',
    aliases: ['tc', 'TC', 'turks and caicos islands', '土克斯及凱科斯群島'],
  },
  '🇹🇫': {
    en: 'French Southern Territories',
    zh: '法屬南部領地',
    code: 'TF',
    aliases: ['tf', 'TF', 'french southern territories', '法屬南部領地'],
  },
  '🇹🇯': {
    en: 'Tajikistan',
    zh: '塔吉克',
    code: 'TJ',
    aliases: ['tj', 'TJ', 'tajikistan', '塔吉克'],
  },
  '🇹🇰': {
    en: 'Tokelau',
    zh: '托克勞',
    code: 'TK',
    aliases: ['tk', 'TK', 'tokelau', '托克勞'],
  },
  '🇹🇱': {
    en: 'Timor-Leste',
    zh: '東帝汶',
    code: 'TL',
    aliases: ['tl', 'TL', 'timor-leste', '東帝汶'],
  },
  '🇹🇲': {
    en: 'Turkmenistan',
    zh: '土庫曼',
    code: 'TM',
    aliases: ['tm', 'TM', 'turkmenistan', '土庫曼'],
  },
  '🇹🇴': {
    en: 'Tonga',
    zh: '東加',
    code: 'TO',
    aliases: ['to', 'TO', 'tonga', '東加'],
  },
  '🇹🇻': {
    en: 'Tuvalu',
    zh: '吐瓦魯',
    code: 'TV',
    aliases: ['tv', 'TV', 'tuvalu', '吐瓦魯'],
  },
  '🇺🇦': {
    en: 'Ukraine',
    zh: '烏克蘭',
    code: 'UA',
    aliases: ['ua', 'UA', 'ukraine', '烏克蘭'],
  },
  '🇺🇲': {
    en: 'U.S. Minor Outlying Islands',
    zh: '美國本土外小島嶼',
    code: 'UM',
    aliases: ['um', 'UM', 'u.s. minor outlying islands', '美國本土外小島嶼'],
  },
  '🇺🇳': {
    en: 'United Nations',
    zh: '聯合國',
    code: 'UN',
    aliases: ['un', 'UN', 'united nations', '聯合國'],
  },
  '🇺🇿': {
    en: 'Uzbekistan',
    zh: '烏茲別克',
    code: 'UZ',
    aliases: ['uz', 'UZ', 'uzbekistan', '烏茲別克'],
  },
  '🇻🇦': {
    en: 'Vatican City',
    zh: '梵蒂岡',
    code: 'VA',
    aliases: ['va', 'VA', 'vatican city', '梵蒂岡'],
  },
  '🇻🇨': {
    en: 'Saint Vincent and the Grenadines',
    zh: '聖文森及格瑞那丁',
    code: 'VC',
    aliases: ['vc', 'VC', 'saint vincent and the grenadines', '聖文森及格瑞那丁'],
  },
  '🇻🇬': {
    en: 'British Virgin Islands',
    zh: '英屬維京群島',
    code: 'VG',
    aliases: ['vg', 'VG', 'british virgin islands', '英屬維京群島'],
  },
  '🇻🇮': {
    en: 'U.S. Virgin Islands',
    zh: '美屬維京群島',
    code: 'VI',
    aliases: ['vi', 'VI', 'u.s. virgin islands', '美屬維京群島'],
  },
  '🇻🇺': {
    en: 'Vanuatu',
    zh: '萬那杜',
    code: 'VU',
    aliases: ['vu', 'VU', 'vanuatu', '萬那杜'],
  },
  '🇼🇫': {
    en: 'Wallis and Futuna',
    zh: '瓦利斯及富圖納',
    code: 'WF',
    aliases: ['wf', 'WF', 'wallis and futuna', '瓦利斯及富圖納'],
  },
  '🇼🇸': {
    en: 'Samoa',
    zh: '薩摩亞',
    code: 'WS',
    aliases: ['ws', 'WS', 'samoa', '薩摩亞'],
  },
  '🇽🇰': {
    en: 'Kosovo',
    zh: '科索沃',
    code: 'XK',
    aliases: ['xk', 'XK', 'kosovo', '科索沃'],
  },
  '🇾🇪': {
    en: 'Yemen',
    zh: '葉門',
    code: 'YE',
    aliases: ['ye', 'YE', 'yemen', '葉門'],
  },
  '🇾🇹': {
    en: 'Mayotte',
    zh: '馬約特',
    code: 'YT',
    aliases: ['yt', 'YT', 'mayotte', '馬約特'],
  },
}

interface RegionEntry { emoji: string, en: string, zh: string, code: string, aliases: string[] }

const CJK_UNIFIED_IDEOGRAPH_REGEX = /\p{Script=Han}/u

function getRegionEntry(region: string | null | undefined): RegionEntry | null {
  if (!region?.trim())
    return null

  const trimmed = region.trim()
  const direct = emojiToRegionMap[trimmed]
  if (direct)
    return { emoji: trimmed, en: direct.en, zh: direct.zh, code: direct.code, aliases: direct.aliases }

  const lowerRegion = trimmed.toLowerCase()
  for (const [emoji, info] of Object.entries(emojiToRegionMap)) {
    if (info.code.toLowerCase() === lowerRegion || info.aliases.some(alias => alias.toLowerCase() === lowerRegion))
      return { emoji, en: info.en, zh: info.zh, code: info.code, aliases: info.aliases }
  }

  return null
}

/**
 * 检查地区emoji是否匹配搜索词
 * @param regionEmoji 地区emoji（如：🇭🇰）
 * @param searchTerm 搜索词
 * @returns 是否匹配
 */
export function isRegionMatch(regionEmoji: string, searchTerm: string): boolean {
  const lowerSearchTerm = searchTerm.toLowerCase().trim()

  // 直接匹配emoji / 原始值，保留未知地区的搜索能力
  if (regionEmoji === searchTerm)
    return true

  const regionInfo = getRegionEntry(regionEmoji)
  if (!regionInfo)
    return regionEmoji.toLowerCase().includes(lowerSearchTerm)

  // 检查英文名称
  if (regionInfo.en.toLowerCase().includes(lowerSearchTerm))
    return true

  // 检查中文名称
  if (regionInfo.zh.includes(lowerSearchTerm))
    return true

  // 检查别名
  return regionInfo.aliases.some(alias =>
    alias.toLowerCase().includes(lowerSearchTerm),
  )
}

/**
 * 获取地区的显示名称
 * @param regionEmoji 地区emoji
 * @param language 语言 ('en' | 'zh')
 * @returns 地区名称
 */
export function getRegionDisplayName(regionEmoji: string, language: 'en' | 'zh' = 'zh'): string {
  const regionInfo = getRegionEntry(regionEmoji)
  if (!regionInfo)
    return ''

  if (language === 'en')
    return regionInfo.en

  return CJK_UNIFIED_IDEOGRAPH_REGEX.test(regionInfo.zh) ? regionInfo.zh : ''
}

/**
 * 获取所有支持的地区emoji列表
 * @returns 地区emoji数组
 */
export function getSupportedRegions(): string[] {
  return Object.keys(emojiToRegionMap)
}

/**
 * 获取地区代码
 * @param regionEmoji 地区emoji
 * @returns 地区代码（如：HK, CN, US）
 */
export function getRegionCode(regionEmoji: string): string {
  const regionInfo = getRegionEntry(regionEmoji)
  if (!regionInfo)
    return regionEmoji

  return regionInfo.code
}

/**
 * 根据地区代码获取emoji
 * @param code 地区代码（如：HK, CN, US）
 * @returns 地区emoji
 */
export function getEmojiByCode(code: string): string {
  const upperCode = code.toUpperCase()
  for (const [emoji, info] of Object.entries(emojiToRegionMap)) {
    if (info.code === upperCode) {
      return emoji
    }
  }
  return code
}

/**
 * 根据搜索词查找匹配的地区
 * @param searchTerm 搜索词
 * @returns 匹配的地区信息数组
 */
export function searchRegions(searchTerm: string): Array<{ emoji: string, en: string, zh: string, code: string }> {
  const results: Array<{ emoji: string, en: string, zh: string, code: string }> = []
  const lowerSearchTerm = searchTerm.toLowerCase().trim()

  for (const [emoji, info] of Object.entries(emojiToRegionMap)) {
    if (isRegionMatch(emoji, lowerSearchTerm)) {
      results.push({
        emoji,
        en: info.en,
        zh: info.zh,
        code: info.code,
      })
    }
  }

  return results
}

/**
 * 根据别名或代码获取地区信息
 * @param aliasOrCode 别名或代码（如：hk, HK, 香港, hongkong）
 * @returns 地区信息，如果未找到则返回 null
 */
export function getRegionByAlias(aliasOrCode: string): { emoji: string, en: string, zh: string, code: string } | null {
  const regionInfo = getRegionEntry(aliasOrCode)
  if (!regionInfo)
    return null

  return { emoji: regionInfo.emoji, en: regionInfo.en, zh: regionInfo.zh, code: regionInfo.code }
}

/**
 * 从文本中提取地区emoji
 * @param text 包含地区emoji的文本
 * @returns 提取到的地区emoji数组
 */
export function extractRegionEmojis(text: string): string[] {
  const emojis: string[] = []
  // 匹配国旗emoji（由两个区域指示符字符组成）
  const matches = text.match(REGION_FLAG_REGEX)

  if (matches) {
    for (const match of matches) {
      if (emojiToRegionMap[match]) {
        emojis.push(match)
      }
    }
  }

  return emojis
}
