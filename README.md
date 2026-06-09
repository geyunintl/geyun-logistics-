# 歌运物流官网

浙江歌运物流科技有限公司 / 歌运物流高端跨境物流科技官网原型。网站以“全球物流指挥中心”为视觉方向，突出义乌出发、专注美线、亚马逊FBA、海外仓、一件代发、美国海运、美国空运、尾程派送与全国分公司布局。

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- GSAP + ScrollTrigger
- Framer Motion
- Three.js / React Three Fiber / Drei
- Lenis 平滑滚动
- Swiper 轮播

## 本地运行

```bash
npm install
npm run dev
```

打开：`http://localhost:3000`

## 构建部署

```bash
npm run build
npm run start
```

可部署到 Vercel、Netlify 或支持 Node.js 的服务器。

## 页面路由

- `/` 首页
- `/america-line` 美线专线
- `/overseas-warehouse` 海外仓服务
- `/service-network` 服务网络
- `/warehouse` 仓储实力
- `/about` 关于歌运
- `/contact` 联系我们

## 内容修改

所有业务内容集中在 `src/data/`：

- `navigation.ts`：导航
- `home.ts`：首页 Hero、数据驾驶舱、服务矩阵
- `routes.ts`：全球航线节点
- `channels.ts`：美线渠道卡片
- `branches.ts`：全国分公司
- `warehouse.ts`：仓储视频墙
- `flow.ts`：全链路流程
- `contact.ts`：询价表单字段

## 素材替换

现有占位图片位于：

- `public/assets/frame-01.jpg` ~ `frame-36.jpg`

后续可以把真实图片放入 `public/images/`，真实视频放入 `public/videos/`，再修改对应 data 文件中的路径。

## 说明

首页已包含核心模块：全屏 Hero、全球航线地图/3D地球、数据驾驶舱、服务矩阵、美线渠道横向滚动、全国分公司轮播、仓储视频墙、全链路流程动画、物流方案生成器。
