import React from 'react';
import { Button } from "@/components/ui/button";

export const Header = ({ onLogout }) => (
  <div className="bg-white shadow">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <h1 className="text-xl font-semibold">Restaurant Admin</h1>
        <Button variant="outline" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </div>
  </div>
);
