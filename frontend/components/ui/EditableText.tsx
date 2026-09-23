"use client";

import React, { useEffect, useState, useRef } from "react";
import { useEditModeStore } from "../../lib/store/useEditModeStore";
import { getSiteContent, updateSiteContent } from "../../app/actions/content";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";

interface EditableTextProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onAnimationStart'> {
  page: string;
  section: string;
  textKey: string;
  fallback: string;
  as?: any;
  initial?: any;
  animate?: any;
  transition?: any;
  whileInView?: any;
  viewport?: any;
  exit?: any;
}

export const EditableText = ({
  page,
  section,
  textKey,
  fallback,
  className = "",
  as: Component = "span",
  ...rest
}: EditableTextProps) => {
  const { isEditing, isAdmin } = useEditModeStore();
  const [content, setContent] = useState(fallback);
  const [isSaving, setIsSaving] = useState(false);
  const contentRef = useRef<HTMLElement>(null);
  const [localContentObj, setLocalContentObj] = useState<any>({});

  useEffect(() => {
    async function loadContent() {
      const data = await getSiteContent(page, section);
      if (data) {
        setLocalContentObj(data);
        if (data[textKey]) {
          setContent(data[textKey]);
        }
      }
    }
    loadContent();
  }, [page, section, textKey]);

  const handleBlur = async () => {
    if (!contentRef.current || !isAdmin) return;
    
    const newText = contentRef.current.innerText;
    if (newText === content) return; // No changes

    setIsSaving(true);
    try {
      const updatedObj = { ...localContentObj, [textKey]: newText };
      await updateSiteContent(page, section, updatedObj);
      setContent(newText);
      setLocalContentObj(updatedObj);
    } catch (e) {
      console.error("Failed to save content", e);
      // Revert on failure
      if (contentRef.current) {
        contentRef.current.innerText = content;
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      contentRef.current?.blur();
    }
  };

  if (!isEditing) {
    return <Component className={className} {...rest} dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return (
    <Component
      ref={contentRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`${className} outline-none transition-all duration-200 
        hover:ring-2 hover:ring-oro-antiguo hover:ring-offset-2 hover:ring-offset-hueso-seda
        focus:ring-2 focus:ring-verde-ebano focus:ring-offset-2 focus:ring-offset-hueso-seda
        bg-oro-antiguo/10 rounded px-1 cursor-text relative group ${isSaving ? 'animate-pulse ring-2 ring-oro-antiguo' : ''}`}
      {...rest}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
