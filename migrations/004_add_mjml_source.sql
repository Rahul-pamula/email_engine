-- Migration: Add mjml_source column to templates
-- Description: Stores raw MJML source code for GrapesJS editor.

ALTER TABLE templates ADD COLUMN IF NOT EXISTS mjml_source TEXT;
