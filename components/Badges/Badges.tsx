'use client';

import React from 'react';
import { BadgeComponent } from '../BadgeComponent/BadgeComponent';

const STARTING_INDEX = 0;

interface Badge {
  id: number;
  name: string;
}

export const Badges = ({
  badges,
  maxBadgesToShow = null,
}: {
  badges: Array<Badge>;
  maxBadgesToShow?: number | null;
}) => {
  if (maxBadgesToShow && badges.length > maxBadgesToShow) {
    return (
      <>
        {badges.slice(STARTING_INDEX, maxBadgesToShow).map((badge: Badge) => (
          <BadgeComponent name={badge.name} key={badge.name} />
        ))}
        <div className="text-body-md text-onSurfaceVariant ml-2">
          +{badges.length - maxBadgesToShow || 0}
        </div>
      </>
    );
  }
  return badges.map((badge: Badge) => (
    <BadgeComponent name={badge.name} key={badge.name} />
  ));
};

export default Badges;
