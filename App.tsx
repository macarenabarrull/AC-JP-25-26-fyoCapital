import React, { useState, useCallback } from 'react';
import { SLIDES, SlideData } from './constants';
import { SlideLayout } from './components/SlideLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { 
  CoverSlide, 
  ImageSlide,
  TableCapitalSlide,
  InfoSlide,
  TutorContentSlide,
  GridSlide,
  ObjectivesSlide,
  ClosingSlide,
  EcosystemCirclesSlide,
  InteractiveDynamicSlide,
  InvestmentSlide
} from './components/Slides';

const App: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const [isProjectorMode, setIsProjectorMode] = useState(false);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlideIndex((prev) => Math.min(prev + 1, SLIDES.length - 1));
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const jumpToSlide = useCallback((index: number) => {
    setDirection(index > currentSlideIndex ? 1 : -1);
    setCurrentSlideIndex(index);
  }, [currentSlideIndex]);

  const toggleProjectorMode = useCallback(() => {
    setIsProjectorMode(prev => !prev);
  }, []);

  const renderSlide = (data: SlideData) => {
      switch (data.type) {
        case 'cover':
          return <CoverSlide data={data} />;
        case 'image':
          return <ImageSlide data={data} />;
        case 'table-capital':
          return <TableCapitalSlide data={data} />;
        case 'info':
          return <InfoSlide data={data} />;
        case 'tutor-content':
          return <TutorContentSlide data={data} />;
        case 'grid':
          return <GridSlide data={data} />;
        case 'objectives':
          return <ObjectivesSlide data={data} />;
        case 'ecosystem-circles':
          return <EcosystemCirclesSlide data={data} />;
        case 'interactive-dynamic':
          return <InteractiveDynamicSlide data={data} />;
        case 'investment':
          return <InvestmentSlide data={data} />;
        case 'closing':
          return <ClosingSlide data={data} onJumpToSlide={jumpToSlide} />;
        default:
          return <div className="text-red-500">Slide type not found</div>;
      }
  };

  const currentSlideData = SLIDES[currentSlideIndex];

  // Normal View
  return (
    <ErrorBoundary>
      <SlideLayout
        currentSlide={currentSlideIndex}
        totalSlides={SLIDES.length}
        onNext={nextSlide}
        onPrev={prevSlide}
        onJumpToSlide={jumpToSlide}
        isProjectorMode={isProjectorMode}
        onToggleProjectorMode={toggleProjectorMode}
        title={currentSlideData.type !== 'cover' && currentSlideData.type !== 'closing' ? currentSlideData.title : undefined}
        subtitle={currentSlideData.type !== 'cover' && currentSlideData.type !== 'closing' ? currentSlideData.subtitle : undefined}
        direction={direction}
      >
        {renderSlide(currentSlideData)}
      </SlideLayout>
    </ErrorBoundary>
  );
};

export default App;