import React from 'react';
import Card from './Card';

function StatCard({ title, value, icon: Icon, subtext }) {
  return (
    <Card>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-gray-500">{subtext}</p>
    </Card>
  );
}

export default StatCard;