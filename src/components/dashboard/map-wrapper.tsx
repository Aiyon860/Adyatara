"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const DashboardMap = dynamic(() => import('./dashboard-map'), { ssr: false });

export default function MapWrapper() {
    return <DashboardMap />;
}