import React from 'react';
import Link from 'next/link';

interface DashboardLogo {
  fill: string;
}

const DashboardLogo: React.FC<DashboardLogo> = ({ fill }) => {
  return (
    <div className="text-center">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24 13.9167C24 18.6111 20.4183 21 16 21C11.5817 21 8 18.6111 8 13.9167C8 9.22225 11.5817 4 16 4C20.4183 4 24 9.22225 24 13.9167ZM20 13.9167C20 15.1431 19.5837 15.7469 19.1245 16.1224C18.5629 16.5817 17.5352 17 16 17C14.4648 17 13.4371 16.5817 12.8755 16.1224C12.4163 15.7469 12 15.1431 12 13.9167C12 12.5145 12.5643 10.8777 13.5201 9.62838C14.4932 8.35633 15.4372 8 16 8C16.5628 8 17.5068 8.35633 18.4799 9.62838C19.4357 10.8777 20 12.5145 20 13.9167Z"
          fill={fill}
        />
        <path
          d="M16 26.5778C15.2309 27.2546 14.0584 28 12.625 28C11.1753 28 10 26.8807 10 25.5C10 24.1193 11.1753 23 12.625 23C14.0584 23 15.2309 23.7454 16 24.4222C16.7691 23.7454 17.9416 23 19.375 23C20.8247 23 22 24.1193 22 25.5C22 26.8807 20.8247 28 19.375 28C17.9416 28 16.7691 27.2546 16 26.5778Z"
          fill={fill}
        />
      </svg>
    </div>
  );
};

export default DashboardLogo;
