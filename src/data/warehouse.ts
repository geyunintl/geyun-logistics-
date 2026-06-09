const premiumAssetBase = '/assets/geyun/geyun_premium_assets';
const videoBase = '/assets/geyun/videos';

export type WarehouseItem = {
  title: string;
  poster: string;
  src?: string;
  description: string;
};

export const warehouseVideos: WarehouseItem[] = [
  {
    title: '仓储全景',
    poster: `${premiumAssetBase}/04_hero_backgrounds/01_2026-05-26_1346441_dark_hero.jpg`,
    src: `${videoBase}/warehouse_aerial.mp4`,
    description: '4K 航拍歌运核心仓储基地，超大园区规模、光伏顶棚与全天候作业体系一览无余。',
  },
  {
    title: '传送分拣',
    poster: `${premiumAssetBase}/03_video_frames_refined/01_2026-05-26_1346441_clean.jpg`,
    src: `${videoBase}/warehouse_conveyor.mp4`,
    description: '自动传送带高效分拣、人工协同，SKU 精准导流至发货区。',
  },
  {
    title: '货品入仓',
    poster: `${premiumAssetBase}/03_video_frames_refined/02_2026-05-26_1359502_clean.jpg`,
    src: `${videoBase}/warehouse_interior.mp4`,
    description: '大规模收货入仓现场，货架满仓备货，仓容峰值应对实力展现。',
  },
  {
    title: '装柜出运',
    poster: `${premiumAssetBase}/03_video_frames_refined/03_2026-05-26_1400181_clean.jpg`,
    src: `${videoBase}/warehouse_loading.mp4`,
    description: '合德海运整柜出运，到港监控、装柜检查全流程可视化。',
  },
  {
    title: '海外仓衔接',
    poster: `${videoBase}/warehouse_overseas.png`,
    description: '清关提柜、海外仓上架与本土履约。',
  },
];
