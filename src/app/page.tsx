import { HeroSection } from '@/components/home/HeroSection';
import { GlobalRouteMap } from '@/components/home/GlobalRouteMap';
import { DataCockpit } from '@/components/home/DataCockpit';
import { ServiceMatrix } from '@/components/home/ServiceMatrix';
import { ChannelHorizontalScroll } from '@/components/home/ChannelHorizontalScroll';
import { BranchGallery } from '@/components/home/BranchGallery';
import { WarehouseVideoWall } from '@/components/home/WarehouseVideoWall';
import { LogisticsFlow } from '@/components/home/LogisticsFlow';
import { QuoteGenerator } from '@/components/home/QuoteGenerator';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <GlobalRouteMap />
      <DataCockpit />
      <ServiceMatrix />
      <ChannelHorizontalScroll />
      <BranchGallery />
      <WarehouseVideoWall />
      <LogisticsFlow />
      <QuoteGenerator />
    </main>
  );
}
