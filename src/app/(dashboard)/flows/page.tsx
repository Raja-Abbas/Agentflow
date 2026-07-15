"use client";

import { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  NodeProps,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Save,
  Play,
  ArrowLeft,
  Zap,
  Bot,
  GitBranch,
  MessageSquare,
  Globe,
  CircleStop,
  GripVertical,
  Trash2,
  Settings,
} from "lucide-react";

interface FlowNodeData {
  label: string;
  type: string;
  model?: string;
  prompt?: string;
  temperature?: number;
  condition?: string;
  [key: string]: unknown;
}

function TriggerNode({ data }: NodeProps) {
  return (
    <div className="bg-emerald-500 text-white rounded-lg px-4 py-3 shadow-md min-w-[140px] border-2 border-emerald-600">
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-700 !w-3 !h-3" />
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4" />
        <span className="text-sm font-medium">{data.label as string}</span>
      </div>
    </div>
  );
}

function DefaultNode({ data }: NodeProps) {
  const nodeType = data.type as string;
  const colors: Record<string, string> = {
    "ai-response": "bg-indigo-500 border-indigo-600",
    condition: "bg-amber-400 border-amber-500",
    "user-input": "bg-blue-500 border-blue-600",
    "api-call": "bg-purple-500 border-purple-600",
    end: "bg-red-500 border-red-600",
  };
  const icons: Record<string, React.ReactNode> = {
    "ai-response": <Bot className="w-4 h-4" />,
    condition: <GitBranch className="w-4 h-4" />,
    "user-input": <MessageSquare className="w-4 h-4" />,
    "api-call": <Globe className="w-4 h-4" />,
    end: <CircleStop className="w-4 h-4" />,
  };
  const textColors: Record<string, string> = {
    condition: "text-slate-900",
    end: "text-white",
  };

  return (
    <div
      className={`${colors[nodeType] || "bg-slate-500 border-slate-600"} ${textColors[nodeType] || "text-white"} rounded-lg px-4 py-3 shadow-md min-w-[140px] border-2`}
    >
      <Handle type="target" position={Position.Top} className="!w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3" />
      <div className="flex items-center gap-2">
        {icons[nodeType]}
        <span className="text-sm font-medium">{data.label as string}</span>
      </div>
    </div>
  );
}

const nodeTypes = {
  trigger: TriggerNode,
  default: DefaultNode,
};

const initialNodes: Node[] = [
  { id: "1", type: "trigger", position: { x: 250, y: 0 }, data: { label: "Start", type: "trigger" } },
  { id: "2", type: "default", position: { x: 250, y: 150 }, data: { label: "Welcome Message", type: "ai-response", model: "GPT-4", prompt: "You are a friendly support agent...", temperature: 0.7 } },
  { id: "3", type: "default", position: { x: 250, y: 300 }, data: { label: "Check Intent", type: "condition", condition: "intent === 'support'" } },
  { id: "4", type: "default", position: { x: 100, y: 450 }, data: { label: "Support Response", type: "ai-response", model: "GPT-4", prompt: "You are a support specialist...", temperature: 0.5 } },
  { id: "5", type: "default", position: { x: 400, y: 450 }, data: { label: "Sales Response", type: "ai-response", model: "Claude", prompt: "You are a sales representative...", temperature: 0.8 } },
  { id: "6", type: "default", position: { x: 250, y: 600 }, data: { label: "End", type: "end" } },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3" },
  { id: "e3-4", source: "3", target: "4", label: "Support" },
  { id: "e3-5", source: "3", target: "5", label: "Sales" },
  { id: "e4-6", source: "4", target: "6" },
  { id: "e5-6", source: "5", target: "6" },
];

const paletteNodes = [
  { type: "trigger", label: "Trigger", icon: Zap, color: "bg-emerald-500" },
  { type: "ai-response", label: "AI Response", icon: Bot, color: "bg-indigo-500" },
  { type: "condition", label: "Condition", icon: GitBranch, color: "bg-amber-400" },
  { type: "user-input", label: "User Input", icon: MessageSquare, color: "bg-blue-500" },
  { type: "api-call", label: "API Call", icon: Globe, color: "bg-purple-500" },
  { type: "end", label: "End", icon: CircleStop, color: "bg-red-500" },
];

export default function FlowEditorPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNodeData = useCallback(
    (field: string, value: string | number) => {
      if (!selectedNode) return;
      setNodes((nds) =>
        nds.map((n) =>
          n.id === selectedNode.id
            ? { ...n, data: { ...n.data, [field]: value } }
            : n
        )
      );
      setSelectedNode((prev) =>
        prev ? { ...prev, data: { ...prev.data, [field]: value } } : null
      );
    },
    [selectedNode, setNodes]
  );

  const deleteNode = useCallback(() => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
      )
    );
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = {
        x: event.clientX - 300,
        y: event.clientY - 100,
      };

      const newNode: Node = {
        id: `${Date.now()}`,
        type: type === "trigger" ? "trigger" : "default",
        position,
        data: { label: paletteNodes.find((p) => p.type === type)?.label || "Node", type },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  const selectedData = selectedNode?.data as FlowNodeData | undefined;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 h-14 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-500" />
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Customer Support Flow
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Play className="w-4 h-4 mr-1.5" />
            Test
          </Button>
          <Button size="sm">
            <Save className="w-4 h-4 mr-1.5" />
            Save
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Node Palette */}
        <Card className="w-60 shrink-0 rounded-none border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Node Palette
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
            {paletteNodes.map((item) => (
              <div
                key={item.type}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("application/reactflow", item.type);
                  e.dataTransfer.effectAllowed = "move";
                }}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 cursor-grab hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
              >
                <div className={`${item.color} p-1.5 rounded-md text-white`}>
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {item.label}
                </span>
                <GripVertical className="w-3.5 h-3.5 text-slate-400 ml-auto" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Center - React Flow Canvas */}
        <div className="flex-1 bg-slate-50 dark:bg-slate-900">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            fitView
            className="bg-slate-50 dark:bg-slate-900"
          >
            <Background gap={20} size={1} />
            <Controls />
            <MiniMap
              nodeColor={(n) => {
                const t = (n.data as FlowNodeData).type;
                if (t === "trigger") return "#10b981";
                if (t === "ai-response") return "#4f46e5";
                if (t === "condition") return "#facc15";
                if (t === "end") return "#ef4444";
                return "#64748b";
              }}
              maskColor="rgba(0,0,0,0.1)"
            />
          </ReactFlow>
        </div>

        {/* Right Panel - Node Properties */}
        <Card className="w-[280px] shrink-0 rounded-none border-l border-slate-200 dark:border-slate-800 overflow-y-auto">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {selectedNode ? "Node Properties" : "Select a Node"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {selectedNode && selectedData ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Name
                  </label>
                  <Input
                    value={selectedData.label || ""}
                    onChange={(e) => updateNodeData("label", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Type
                  </label>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-md capitalize">
                    {(selectedData.type || "").replace("-", " ")}
                  </div>
                </div>

                {selectedData.type === "ai-response" && (
                  <>
                    <Select
                      label="Model"
                      value={selectedData.model || ""}
                      onChange={(e) => updateNodeData("model", e.target.value)}
                      options={[
                        { value: "GPT-4", label: "GPT-4" },
                        { value: "GPT-3.5", label: "GPT-3.5" },
                        { value: "Claude", label: "Claude" },
                        { value: "Llama 2", label: "Llama 2" },
                      ]}
                    />
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        System Prompt
                      </label>
                      <Textarea
                        value={selectedData.prompt || ""}
                        onChange={(e) => updateNodeData("prompt", e.target.value)}
                        rows={4}
                        placeholder="Enter system prompt..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Temperature: {selectedData.temperature ?? 0.7}
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={2}
                        step={0.1}
                        value={selectedData.temperature ?? 0.7}
                        onChange={(e) =>
                          updateNodeData("temperature", parseFloat(e.target.value))
                        }
                        className="w-full accent-indigo-500"
                      />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Precise</span>
                        <span>Creative</span>
                      </div>
                    </div>
                  </>
                )}

                {selectedData.type === "condition" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Condition Expression
                    </label>
                    <Textarea
                      value={selectedData.condition || ""}
                      onChange={(e) => updateNodeData("condition", e.target.value)}
                      rows={3}
                      placeholder="e.g. intent === 'support'"
                    />
                  </div>
                )}

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={deleteNode}
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Delete Node
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Click on a node in the canvas to view and edit its properties.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
