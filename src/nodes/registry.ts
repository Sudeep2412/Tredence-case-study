import { ComponentType } from 'react';
import { z } from 'zod';
import { StartNodeSchema, StartNodeData, StartNodeComponent, StartNodeProperties } from './StartNode';
import { TaskNodeSchema, TaskNodeData, TaskNodeComponent, TaskNodeProperties } from './TaskNode';
import { ApprovalNodeSchema, ApprovalNodeData, ApprovalNodeComponent, ApprovalNodeProperties } from './ApprovalNode';
import { AutomatedNodeSchema, AutomatedNodeData, AutomatedNodeComponent, AutomatedNodeProperties } from './AutomatedNode';
import { EndNodeSchema, EndNodeData, EndNodeComponent, EndNodeProperties } from './EndNode';

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface NodeDefinition {
  type: NodeType;
  component: ComponentType<any>;
  schema: z.ZodSchema<any>;
  propertiesComponent: ComponentType<any>;
  defaultData: any;
}

export const NodeRegistry: Record<NodeType, NodeDefinition> = {
  start: {
    type: 'start',
    component: StartNodeComponent,
    schema: StartNodeSchema,
    propertiesComponent: StartNodeProperties,
    defaultData: StartNodeData,
  },
  task: {
    type: 'task',
    component: TaskNodeComponent,
    schema: TaskNodeSchema,
    propertiesComponent: TaskNodeProperties,
    defaultData: TaskNodeData,
  },
  approval: {
    type: 'approval',
    component: ApprovalNodeComponent,
    schema: ApprovalNodeSchema,
    propertiesComponent: ApprovalNodeProperties,
    defaultData: ApprovalNodeData,
  },
  automated: {
    type: 'automated',
    component: AutomatedNodeComponent,
    schema: AutomatedNodeSchema,
    propertiesComponent: AutomatedNodeProperties,
    defaultData: AutomatedNodeData,
  },
  end: {
    type: 'end',
    component: EndNodeComponent,
    schema: EndNodeSchema,
    propertiesComponent: EndNodeProperties,
    defaultData: EndNodeData,
  },
};

export const customNodeTypes = Object.keys(NodeRegistry).reduce((acc, key) => {
  acc[key] = NodeRegistry[key as NodeType].component;
  return acc;
}, {} as Record<string, ComponentType<any>>);
