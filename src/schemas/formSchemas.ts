
import { z } from 'zod';

export const namespaceSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().optional(),
});

export const attributeSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  type: z.string().min(1, 'El tipo es obligatorio'),
  accessModifier: z.enum(['public', 'private', 'protected']),
  defaultValue: z.string().optional(),
});

export const parameterSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  type: z.string().min(1, 'El tipo es obligatorio'),
});

export const methodSignatureSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  returnType: z.string().min(1, 'El tipo de retorno es obligatorio'),
  parameters: z.array(parameterSchema).default([]),
});

export const classSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  namespace: z.string().optional(),
  inheritsFrom: z.string().optional(),
  isAbstract: z.boolean().default(false),
  isSealed: z.boolean().default(false),
  attributes: z.array(attributeSchema).default([]),
});

export const methodSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  returnType: z.string().min(1, 'El tipo de retorno es obligatorio'),
  parameters: z.array(parameterSchema).default([]),
  belongsToClass: z.string().min(1, 'Debe seleccionar una clase'),
});

export const interfaceSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  namespace: z.string().min(1, 'El namespace es obligatorio'),
  methodSignatures: z.array(methodSignatureSchema).default([]),
});

export type NamespaceFormData = z.infer<typeof namespaceSchema>;
export type AttributeFormData = z.infer<typeof attributeSchema>;
export type ParameterFormData = z.infer<typeof parameterSchema>;
export type MethodSignatureFormData = z.infer<typeof methodSignatureSchema>;
export type ClassFormData = z.infer<typeof classSchema>;
export type MethodFormData = z.infer<typeof methodSchema>;
export type InterfaceFormData = z.infer<typeof interfaceSchema>;
