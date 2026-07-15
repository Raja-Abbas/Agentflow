"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface FlowNode {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  model?: string;
  prompt?: string;
  temperature?: number;
  condition?: string;
}

interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

const initialNodes: FlowNode[] = [
  { id: "1", label: "Start", type: "trigger", x: 280, y: 20 },
  { id: "2", label: "Welcome Message", type: "ai-response", x: 260, y: 140, model: "GPT-4", prompt: "You are a friendly support agent...", temperature: 0.7 },
  { id: "3", label: "Check Intent", type: "condition", x: 270, y: 260, condition: "intent === 'support'" },
  { id: "4", label: "Support Response", type: "ai-response", x: 80, y: 380, model: "GPT-4", prompt: "You are a support specialist...", temperature: 0.5 },
  { id: "5", label: "Sales Response", type: "ai-response", x: 420, y: 380, model: "Claude", prompt: "You are a sales representative...", temperature: 0.8 },
  { id: "6", label: "End", type: "end", x: 290, y: 500 },
];

const initialEdges: FlowEdge[] = [
  { id: "e1-2", source: "1", target: "2" },
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

const nodeColors: Record<string, string> = {
  trigger: "bg-emerald-500 border-emerald-600 text-white",
  "ai-response": "bg-indigo-500 border-indigo-600 text-white",
  condition: "bg-amber-400 border-amber-500 text-slate-900",
  "user-input": "bg-blue-500 border-blue-600 text-white",
  "api-call": "bg-purple-500 border-purple-600 text-white",
  end: "bg-red-500 border-red-600 text-white",
};

const nodeIcons: Record<string, React.ReactNode> = {
  trigger: <Zap className="w-4 h-4" />,
  "ai-response": <Bot className="w-4 h-4" />,
  condition: <GitBranch className="w-4 h-4" />,
  "user-input": <MessageSquare className="w-4 h-4" />,
  "api-call": <Globe className="w-4 h-4" />,
  end: <CircleStop className="w-4 h-4" />,
};

export default function FlowEditorPage() {
  const [nodes, setNodes] = useState<FlowNode[]>(initialNodes);
  const [edges] = useState<FlowEdge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const updateNodeData = useCallback(
    (field: string, value: string | number) => {
      if (!selectedNodeId) return;
      setNodes((prev) =>
        prev.map((n) =>
          n.id === selectedNodeId ? { ...n, [field]: value } : n
        )
      );
    },
    [selectedNodeId]
  );

  const deleteNode = useCallback(() => {
    if (!selectedNodeId) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
    setSelectedNodeId(null);
  }, [selectedNodeId]);

  const handleDragEnd = useCallback(
    (id: string, e: React.DragEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - 70;
      const y = e.clientY - rect.top - 20;
      setNodes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, x: Math.max(0, x), y: Math.max(0, y) } : n))
      );
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("application/reactflow");
      if (!type) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - 70;
      const y = e.clientY - rect.top - 20;
      const label = paletteNodes.find((p) => p.type === type)?.label || "Node";
      const newNode: FlowNode = {
        id: `${Date.now()}`,
        label,
        type,
        x: Math.max(0, x),
        y: Math.max(0, y),
      };
      setNodes((prev) => [...prev, newNode]);
    },
    []
  );

  const getEdgePath = (source: FlowNode, target: FlowNode) => {
    const sx = source.x + 70;
    const sy = source.y + 40;
    const tx = target.x + 70;
    const ty = target.y;
    const midY = (sy + ty) / 2;
    return `M ${sx} ${sy} C ${sx} ${midY}, ${tx} ${midY}, ${tx} ${ty}`;
  };

  const getNodeCenter = (node: FlowNode) => ({
    x: node.x + 70,
    y: node.y + 40,
  });

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 h-14 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-500" />
            <h1 className="text-lg font-semibold text-slate-900">
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
        <Card className="w-60 shrink-0 rounded-none border-r border-slate-200 overflow-y-auto">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-semibold text-slate-700">
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
                className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-grab hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <div className={`${item.color} p-1.5 rounded-md text-white`}>
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {item.label}
                </span>
                <GripVertical className="w-3.5 h-3.5 text-slate-400 ml-auto" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Center - Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 bg-slate-50 relative overflow-auto"
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
          onDrop={handleDrop}
          onClick={() => setSelectedNodeId(null)}
        >
          {/* Grid background */}
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }} />

          {/* Edges SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: 700, minHeight: 580 }}>
            {edges.map((edge) => {
              const source = nodes.find((n) => n.id === edge.source);
              const target = nodes.find((n) => n.id === edge.target);
              if (!source || !target) return null;
              const path = getEdgePath(source, target);
              const mid = {
                x: (getNodeCenter(source).x + getNodeCenter(target).x) / 2,
                y: (getNodeCenter(source).y + getNodeCenter(target).y) / 2,
              };
              return (
                <g key={edge.id}>
                  <path d={path} fill="none" stroke="#94a3b8" strokeWidth={2} />
                  <circle cx={getNodeCenter(target).x} cy={getNodeCenter(target).y} r={4} fill="#94a3b8" />
                  {edge.label && (
                    <>
                      <rect x={mid.x - 30} y={mid.y - 10} width={60} height={20} rx={4} fill="white" stroke="#e2e8f0" />
                      <text x={mid.x} y={mid.y + 4} textAnchor="middle" className="text-xs fill-slate-600 font-medium">
                        {edge.label}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              draggable
              onDragEnd={(e) => handleDragEnd(node.id, e)}
              onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
              className={`absolute cursor-grab active:cursor-grabbing rounded-lg border-2 px-4 py-3 shadow-md min-w-[140px] transition-shadow ${
                nodeColors[node.type] || "bg-slate-500 border-slate-600 text-white"
              } ${selectedNodeId === node.id ? "ring-2 ring-indigo-400 ring-offset-2" : ""}`}
              style={{ left: node.x, top: node.y }}
            >
              <div className="flex items-center gap-2">
                {nodeIcons[node.type]}
                <span className="text-sm font-medium">{node.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel - Node Properties */}
        <Card className="w-[280px] shrink-0 rounded-none border-l border-slate-200 overflow-y-auto">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-semibold text-slate-700">
              {selectedNode ? "Node Properties" : "Select a Node"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {selectedNode ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Name</label>
                  <Input
                    value={selectedNode.label}
                    onChange={(e) => updateNodeData("label", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Type</label>
                  <div className="text-sm font-medium text-slate-700 bg-slate-100 px-3 py-2 rounded-md capitalize">
                    {selectedNode.type.replace("-", " ")}
                  </div>
                </div>

                {selectedNode.type === "ai-response" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500">Model</label>
                      <select
                        value={selectedNode.model || ""}
                        onChange={(e) => updateNodeData("model", e.target.value)}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                      >
                        <option value="GPT-4">GPT-4</option>
                        <option value="GPT-3.5">GPT-3.5</option>
                        <option value="Claude">Claude</option>
                        <option value="Gemini">Gemini</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500">System Prompt</label>
                      <Textarea
                        value={selectedNode.prompt || ""}
                        onChange={(e) => updateNodeData("prompt", e.target.value)}
                        rows={4}
                        placeholder="Enter system prompt..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500">
                        Temperature: {selectedNode.temperature ?? 0.7}
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={2}
                        step={0.1}
                        value={selectedNode.temperature ?? 0.7}
                        onChange={(e) => updateNodeData("temperature", parseFloat(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Precise</span>
                        <span>Creative</span>
                      </div>
                    </div>
                  </>
                )}

                {selectedNode.type === "condition" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500">Condition Expression</label>
                    <Textarea
                      value={selectedNode.condition || ""}
                      onChange={(e) => updateNodeData("condition", e.target.value)}
                      rows={3}
                      placeholder="e.g. intent === 'support'"
                    />
                  </div>
                )}

                <div className="pt-4 border-t border-slate-200">
                  <Button variant="destructive" size="sm" className="w-full" onClick={deleteNode}>
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Delete Node
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Click on a node in the canvas to view and edit its properties.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
