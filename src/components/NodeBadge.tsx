import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const NodeBadge = ({ isValid, errors }: { isValid: boolean, errors: string[] }) => {
  if (isValid) return null;

  return (
    <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 group cursor-help z-10 shadow-lg">
      <AlertTriangle size={12} className="text-white" />
      <div className="hidden group-hover:block absolute top-full mt-2 right-0 w-48 bg-gray-900 border border-red-500/50 p-2 rounded-md shadow-xl text-xs text-red-200 z-20">
        <ul className="list-disc pl-3">
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
