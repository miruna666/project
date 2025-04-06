'use client'
import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const images = [
  { id: '1', src: '/images/baiatulsibunica.png' },
  { id: '2', src: '/images/baiatulajutaalbina.png' },
  { id: '3', src: '/images/baiatulsejaoca.png' },
];

const correctOrder = images.map((img) => img.id);

function getShuffledNotCorrect(original: string[]): string[] {
  let shuffled = [...original];
  do {
    shuffled = [...original].sort(() => Math.random() - 0.5);
  } while (shuffled.join() === original.join());
  return shuffled;
}

function SortableImage({ id, src }: { id: string; src: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    border: '2px solid #ddd',
    borderRadius: 12,
    padding: 8,
    background: '#fff',
    height: '450px',
    width: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img src={src} alt={id} style={{ height: '100%', width: 'auto', borderRadius: 8 }} />
    </div>
  );
}

export default function ImageSortGame() {
  const [items, setItems] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [currentLottie, setCurrentLottie] = useState<string | null>(null);

  useEffect(() => {
    const initial = getShuffledNotCorrect(correctOrder);
    setItems(initial);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      const isCorrect = newItems.every((id, index) => id === correctOrder[index]);

      if (isCorrect) {
        setFeedback('🎉 Corect! Ai terminat!');
        setCompleted(true);
        setShowFireworks(true);
        setCurrentLottie('/animations/artificii2.json');
      } else if (newItems[newIndex] === correctOrder[newIndex]) {
        setFeedback('✅ Mutare corectă!');
        setCurrentLottie('/animations/correctanswer.json');
      } else {
        setFeedback('❌ Mutare greșită!');
        setCurrentLottie('/animations/wronganswer.json');
      }

      setTimeout(() => {
        setFeedback(null);
        setCurrentLottie(null);
      }, 1500);
    }
  };

  const resetGame = () => {
    setItems(getShuffledNotCorrect(correctOrder));
    setCompleted(false);
    setShowFireworks(false);
    setCurrentLottie(null);
    setFeedback(null);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        justifyContent: 'center',
        position: 'relative',
        padding: 24,
      }}
    >
      <motion.div
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          maxWidth: '800px',
          width: '100%',
          marginBottom: '30px',
          textAlign: 'center'
        }}
      >
        <h1 style={{ margin: 0, fontSize: '2rem', color: '#333' }}>🐝 Ordonare cronologică </h1>
        <p style={{ marginTop: '10px', fontSize: '1.2rem', color: '#666' }}>
          Pune imaginile în ordine cronologică pentru a câștiga jocul!
        </p>
      </motion.div>


      {feedback && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            fontSize: 24,
            margin: '10px 0',
            color: completed ? 'green' : '#333',
            background: 'rgba(255,255,255,0.9)',
            padding: '10px 20px',
            borderRadius: 12,
          }}
        >
          {feedback}
        </motion.div>
      )}

      {currentLottie && !completed && (
        <div style={{ marginBottom: 24 }}>
          <DotLottieReact
            src={currentLottie}
            autoplay
            loop={false}
            style={{ width: 150, height: 150 }}
          />
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div style={{ display: 'flex', gap: 24 }}>
            {items.map((id) => {
              const img = images.find((img) => img.id === id);
              return img ? <SortableImage key={id} id={id} src={img.src} /> : null;
            })}
          </div>
        </SortableContext>
      </DndContext>

      {completed && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          style={{
            marginTop: 40,
            padding: '12px 24px',
            fontSize: 18,
            borderRadius: 12,
            background: '#4CAF50',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          🔄 Joacă din nou
        </motion.button>
      )}

      {showFireworks && (
        <DotLottieReact
          src="/animations/artificii2.json"
          autoplay
          loop={false}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}