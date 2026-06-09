export const routeNodes = [
  { city: '义乌', country: '中国', lat: 29.3069, lon: 120.0753, description: '歌运物流运营中枢，连接全国货源与国际通道。' },
  { city: '洛杉矶', country: '美国', lat: 34.0522, lon: -118.2437, description: '美西核心口岸，快船卡派与海外仓衔接。' },
  { city: '纽约', country: '美国', lat: 40.7128, lon: -74.006, description: '美东派送网络，覆盖FBA与商业地址。' },
  { city: '墨西哥城', country: '墨西哥', lat: 19.4326, lon: -99.1332, description: '北美延伸网络，服务跨境增长市场。' },
  { city: '伦敦', country: '英国', lat: 51.5072, lon: -0.1276, description: '欧洲目的港与电商履约节点。' },
  { city: '汉堡', country: '德国', lat: 53.5511, lon: 9.9937, description: '欧洲港口联动与分拨服务。' },
];

export const routeLines = routeNodes.filter((node) => node.city !== '义乌').map((node) => ({ from: '义乌', to: node.city }));
