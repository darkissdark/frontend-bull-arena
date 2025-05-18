import { Component } from 'react';
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

interface MatadorState {
  prevApplause: number;
}

export class Matador extends Component<MatadorProps, MatadorState> {
  constructor(props: MatadorProps) {
    super(props);
    this.state = {
      prevApplause: 0,
    };
  }

  componentDidMount() {
    document.addEventListener('bullRun', this.handleBullRun);
  }

  componentWillUnmount() {
    document.removeEventListener('bullRun', this.handleBullRun);
  }

  componentDidUpdate() {
    const { applause } = this.props;
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

      this.setState({ prevApplause: applause });
    }
  }

  handleBullRun = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;

    const { position } = event.detail;
    const { matadorPosition, setMatarodPosition } = this.props;
    const totalPositions = 8;

    if (matadorPosition !== undefined && position === matadorPosition) {
      let newPosition = matadorPosition;

      while (newPosition === matadorPosition || newPosition === position) {
        newPosition = Math.floor(Math.random() * totalPositions);
      }

      console.log(
        `Matador is moving from ${matadorPosition} to ${newPosition}`
      );

      setTimeout(() => {
        setMatarodPosition?.(newPosition);
      }, 1000);
    }
  };

  shouldComponentUpdate(nextProps: MatadorProps) {
    return nextProps.applause === 3 && this.props.applause !== 3;
  }

  render() {
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
  }
}
