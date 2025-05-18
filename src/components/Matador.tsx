import { useEffect, memo, useState } from 'react';
import './Matador.css';
import applause1 from '../assets/applause1.mp3';
import applause2 from '../assets/applause2.mp3';
import applause3 from '../assets/applause3.mp3';
import applause4 from '../assets/applause4.mp3';

interface MatadorProps {
  applause?: number;
  matadorPosition?: number;
  setMatarodPosition?: (position: number) => void;
}

const MatadorComponent = ({
  applause,
  matadorPosition,
  setMatarodPosition,
}: MatadorProps) => {
  const [prevApplause, setPrevApplause] = useState(0);

  useEffect(() => {
    const totalPositions = 8;

    const getRandomNewPosition = (
      matadorPosition: number,
      total: number
    ): number => {
      let newPos = matadorPosition;
      while (newPos === matadorPosition) {
        newPos = Math.floor(Math.random() * total);
      }
      return newPos;
    };

    const handleBullRun = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;

      const { position } = event.detail;

      if (matadorPosition !== undefined && position === matadorPosition) {
        const newPosition = getRandomNewPosition(
          matadorPosition,
          totalPositions
        );
        console.log(
          `Matador is moving from ${matadorPosition} to ${newPosition}`
        );

        setTimeout(() => {
          setMatarodPosition?.(newPosition);
        }, 1000);
      }
    };

    document.addEventListener('bullRun', handleBullRun);
    return () => document.removeEventListener('bullRun', handleBullRun);
  }, [matadorPosition, setMatarodPosition]);

  useEffect(() => {
    const soundMap: Record<number, string> = {
      0: applause1,
      1: applause2,
      2: applause3,
      3: applause4,
    };

    if (applause !== undefined && applause in soundMap) {
      const audio = new Audio(soundMap[applause]);
      audio.play().catch(error => {
        if (error.name === 'NotAllowedError') {
          console.warn('Audio playback failed: User interaction required.');
        } else {
          console.error(error);
        }
      });

      setPrevApplause(applause);
    }
  }, [applause]);

  return (
    <div className="matador-canvas">
      <div className="matador-matador">
        <div className="matador-head">
          <div className="matador-hat" />
          <div className="matador-eye left" />
          <div className="matador-eye right" />
          <div className="matador-nose" />
          <div className="matador-mouth" />
        </div>
        <div className="matador-torso" />
        <div className="matador-arm left" />
        <div className="matador-arm right" />
        <div className="matador-cape" />
      </div>
    </div>
  );
};

const shouldComponentUpdate = (
  prevProps: MatadorProps,
  nextProps: MatadorProps
): boolean => {
  return nextProps.applause === 3 && prevProps.applause !== 3;
};

export const Matador = memo(MatadorComponent, shouldComponentUpdate);
