import React from 'react';
import { Color, Size, Spacing } from 'lib/client/types';
import { generateSpacing } from 'lib/client/helpers';
import { FC, MouseEventHandler, ReactNode } from 'react';

interface TopPointsAccumulationProps {
  participants: Participant[];
  bg?: Color;
  fg?: Color;
  fontSize?: Size;
  fontWeight?: number;
  m?: Spacing;
  p?: Spacing;
  onClick?: MouseEventHandler;
  children: ReactNode;
}

interface Participant {
  name: string;
  points: number;
}

const TopPointsAccumulation: FC<TopPointsAccumulationProps> = ({
  participants,
  children,
  bg = 'background-alt',
  fg = 'foreground',
  fontSize = 'md',
  fontWeight = 500,
  m = {
    t: 4,
    r: 4,
    b: 4,
    l: 4,
  },
  p = {
    t: 8,
    r: 16,
    b: 8,
    l: 16,
  },
  onClick,
}: TopPointsAccumulationProps) => {
  const handleButtonClick = () => {
    if (participants.length > 0) {
      const maxPoints = Math.max(...participants.map((participant) => participant.points));
      const topParticipants = participants.filter((participant) => participant.points === maxPoints);
      const topParticipantNames = topParticipants.map((participant) => participant.name);

      alert(`Top Points Accumulation: ${topParticipantNames.join(', ')}`);
    } else {
      alert('No participants available.');
    }
  };

  return (
    <>
      <button onClick={handleButtonClick}>{children}</button>
      <style jsx>{`
        button {
          color: var(--color-${fg});
          background: var(--color-${bg});
          font-size: var(--size-${fontSize});
          font-weight: ${fontWeight};

          margin: ${generateSpacing(m)};
          padding: ${generateSpacing(p)};
          border: none;
          cursor: pointer;
          border-radius: 5px;

          transition: filter 0.4s;
        }

        button:hover {
          filter: brightness(1.1);
        }
      `}</style>
    </>
  );
};

export default TopPointsAccumulation;
