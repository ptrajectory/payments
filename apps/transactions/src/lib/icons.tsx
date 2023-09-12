"use client";

import * as icons from "lucide-react";



export const AppIcon = (name: keyof typeof icons)=>{
    return icons?.[name]
}