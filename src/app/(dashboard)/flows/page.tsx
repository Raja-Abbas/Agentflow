"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trackNodeUsage } from "@/lib/utils";
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
  Undo2,
  Redo2,
  Settings,
  History,
  Mic,
  MicOff,
  Send,
  StepForward,
  Pause,
  PlayIcon,
  Bug,
  X,
  ChevronRight,
  Check,
  RotateCcw,
  Download,
  Upload,
  Link as LinkIcon,
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

interface FlowVersion {
  id: string;
  version: number;
  name: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  createdAt: string;
}

interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

const flowTemplates: FlowTemplate[] = [
  {
    id: "customer-support",
    name: "Customer Support",
    description: "Handle customer inquiries with intent routing and GPT-4 responses",
    icon: "Bot",
    nodes: [
      { id: "1", label: "Start", type: "trigger", x: 280, y: 20 },
      { id: "2", label: "Greeting", type: "ai-response", x: 260, y: 150, model: "GPT-4", prompt: "You are a friendly support agent. Greet the customer warmly and ask how you can help.", temperature: 0.7 },
      { id: "3", label: "Check Intent", type: "condition", x: 270, y: 280, condition: "intent === 'support'" },
      { id: "4", label: "Handle Issue", type: "ai-response", x: 60, y: 410, model: "GPT-4", prompt: "You are a support specialist. Help the customer resolve their issue step by step.", temperature: 0.5 },
      { id: "5", label: "Sales Redirect", type: "ai-response", x: 440, y: 410, model: "Claude", prompt: "You are a sales representative. Help the customer find the right product.", temperature: 0.8 },
      { id: "6", label: "End", type: "end", x: 290, y: 540 },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4", label: "Support" },
      { id: "e3-5", source: "3", target: "5", label: "Sales" },
      { id: "e4-6", source: "4", target: "6" },
      { id: "e5-6", source: "5", target: "6" },
    ],
  },
  {
    id: "lead-qualification",
    name: "Lead Qualification",
    description: "Qualify leads by collecting info and routing to sales",
    icon: "UserCheck",
    nodes: [
      { id: "1", label: "Start", type: "trigger", x: 280, y: 20 },
      { id: "2", label: "Welcome", type: "ai-response", x: 260, y: 150, model: "GPT-4", prompt: "Welcome! Let me help qualify you as a lead. What's your name and company?", temperature: 0.7 },
      { id: "3", label: "Collect Email", type: "user-input", x: 260, y: 280 },
      { id: "4", label: "Check Budget", type: "condition", x: 270, y: 410, condition: "budget > 1000" },
      { id: "5", label: "Route to Sales", type: "ai-response", x: 60, y: 540, model: "GPT-4", prompt: "Thank you! A sales rep will contact you within 24 hours.", temperature: 0.5 },
      { id: "6", label: "Nurture Track", type: "ai-response", x: 440, y: 540, model: "Claude", prompt: "Thanks for your interest! Here are some resources to learn more while you evaluate.", temperature: 0.6 },
      { id: "7", label: "End", type: "end", x: 290, y: 670 },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5", label: "Qualified" },
      { id: "e4-6", source: "4", target: "6", label: "Not Ready" },
      { id: "e5-7", source: "5", target: "7" },
      { id: "e6-7", source: "6", target: "7" },
    ],
  },
  {
    id: "faq-bot",
    name: "FAQ Bot",
    description: "Answer frequently asked questions from your knowledge base",
    icon: "HelpCircle",
    nodes: [
      { id: "1", label: "Start", type: "trigger", x: 280, y: 20 },
      { id: "2", label: "Ask Question", type: "user-input", x: 260, y: 150 },
      { id: "3", label: "Search KB", type: "ai-response", x: 260, y: 280, model: "Gemini", prompt: "Answer the user's question based on general knowledge. Be concise and helpful.", temperature: 0.3 },
      { id: "4", label: "Confirm Answer", type: "condition", x: 270, y: 410, condition: "user_satisfied === true" },
      { id: "5", label: "End", type: "end", x: 290, y: 540 },
      { id: "6", label: "Escalate", type: "api-call", x: 440, y: 540, prompt: "Escalate to human support via API" },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5", label: "Yes" },
      { id: "e4-6", source: "4", target: "6", label: "No" },
    ],
  },
];

interface DebugStep {
  nodeId: string;
  label: string;
  type: string;
  input: string;
  output: string;
  decision?: string;
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
  condition: "bg-amber-400 border-amber-500 text-slate-900 dark:text-slate-100",
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

function findOutgoingEdge(nodeId: string, edges: FlowEdge[], label?: string): FlowEdge | undefined {
  const outgoing = edges.filter((e) => e.source === nodeId);
  if (label && outgoing.length > 1) return outgoing.find((e) => e.label === label);
  return outgoing[0];
}

function getNextNode(currentId: string, edges: FlowEdge[], nodes: FlowNode[], decision?: string): string | null {
  const outgoing = edges.filter((e) => e.source === currentId);
  if (outgoing.length === 0) return null;
  if (outgoing.length === 1) return outgoing[0].target;
  if (decision) {
    const match = outgoing.find((e) => e.label === decision);
    return match?.target || outgoing[0].target;
  }
  return outgoing[0].target;
}

export default function FlowEditorPage() {
  const [nodes, setNodes] = useState<FlowNode[]>(initialNodes);
  const [edges] = useState<FlowEdge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [history, setHistory] = useState<{ nodes: FlowNode[] }[]>([{ nodes: JSON.parse(JSON.stringify(initialNodes)) }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(240);
  const [rightPanelWidth, setRightPanelWidth] = useState(280);
  const isResizing = useRef<"left" | "right" | null>(null);

  const [versions, setVersions] = useState<FlowVersion[]>([]);
  const [showVersionPanel, setShowVersionPanel] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [debugSteps, setDebugSteps] = useState<DebugStep[]>([]);
  const [currentDebugNode, setCurrentDebugNode] = useState<string | null>(null);
  const [debugInput, setDebugInput] = useState("");
  const [debugMessages, setDebugMessages] = useState<{ role: string; content: string }[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [flowName, setFlowName] = useState("Customer Support Flow");
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);

  const pushHistory = useCallback((newNodes: FlowNode[]) => {
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, { nodes: JSON.parse(JSON.stringify(newNodes)) }];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setNodes(JSON.parse(JSON.stringify(history[newIndex].nodes)));
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setNodes(JSON.parse(JSON.stringify(history[newIndex].nodes)));
  }, [historyIndex, history]);

  const handleMouseDown = useCallback((side: "left" | "right") => {
    isResizing.current = side;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const seen = localStorage.getItem("af_onboarding_seen");
    if (!seen) setShowOnboarding(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      if (isResizing.current === "left") {
        setLeftPanelWidth(Math.max(180, Math.min(400, e.clientX)));
      } else {
        setRightPanelWidth(Math.max(200, Math.min(500, window.innerWidth - e.clientX)));
      }
    };
    const handleMouseUp = () => {
      isResizing.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const flowData = params.get("flow");
    if (flowData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(flowData)));
        if (decoded.nodes && decoded.edges) {
          setNodes(decoded.nodes);
          pushHistory(decoded.nodes);
          if (decoded.name) setFlowName(decoded.name);
        }
      } catch { /* ignore invalid URLs */ }
    }
  }, [pushHistory]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const currentDebugNodeData = nodes.find((n) => n.id === currentDebugNode);

  const updateNodeData = useCallback(
    (field: string, value: string | number) => {
      if (!selectedNodeId) return;
      setNodes((prev) => {
        const next = prev.map((n) =>
          n.id === selectedNodeId ? { ...n, [field]: value } : n
        );
        pushHistory(next);
        return next;
      });
    },
    [selectedNodeId, pushHistory]
  );

  const deleteNode = useCallback(() => {
    if (!selectedNodeId) return;
    setNodes((prev) => {
      const next = prev.filter((n) => n.id !== selectedNodeId);
      pushHistory(next);
      return next;
    });
    setSelectedNodeId(null);
  }, [selectedNodeId, pushHistory]);

  const handleDragEnd = useCallback(
    (id: string, e: React.DragEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - 70;
      const y = e.clientY - rect.top - 20;
      setNodes((prev) => {
        const next = prev.map((n) => (n.id === id ? { ...n, x: Math.max(0, x), y: Math.max(0, y) } : n));
        pushHistory(next);
        return next;
      });
    },
    [pushHistory]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("application/reactflow");
      if (!type) return;
      trackNodeUsage(type);
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
      setNodes((prev) => {
        const next = [...prev, newNode];
        pushHistory(next);
        return next;
      });
    },
    [pushHistory]
  );

  const saveVersion = useCallback(() => {
    const newVersion: FlowVersion = {
      id: `v${Date.now()}`,
      version: versions.length + 1,
      name: `v${versions.length + 1}`,
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      createdAt: new Date().toISOString(),
    };
    setVersions((prev) => [...prev, newVersion]);
  }, [nodes, edges, versions.length]);

  const restoreVersion = useCallback((version: FlowVersion) => {
    setNodes(JSON.parse(JSON.stringify(version.nodes)));
    pushHistory(JSON.parse(JSON.stringify(version.nodes)));
    setSelectedNodeId(null);
    setShowVersionPanel(false);
  }, [pushHistory]);

  const exportFlow = useCallback(() => {
    const data = { name: flowName, nodes, edges };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${flowName.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [flowName, nodes, edges]);

  const importFlow = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.nodes && data.edges) {
            setNodes(data.nodes);
            pushHistory(data.nodes);
            if (data.name) setFlowName(data.name);
          }
        } catch { /* ignore invalid files */ }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [pushHistory]);

  const loadTemplate = useCallback((template: FlowTemplate) => {
    setNodes(JSON.parse(JSON.stringify(template.nodes)));
    pushHistory(JSON.parse(JSON.stringify(template.nodes)));
    setFlowName(template.name);
    setShowTemplateDialog(false);
  }, [pushHistory]);

  const copyShareLink = useCallback(() => {
    const data = { name: flowName, nodes, edges };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    const url = `${window.location.origin}${window.location.pathname}?flow=${encoded}`;
    navigator.clipboard.writeText(url);
  }, [flowName, nodes, edges]);

  const startDebug = useCallback(() => {
    const triggerNode = nodes.find((n) => n.type === "trigger");
    if (!triggerNode) return;
    setDebugMode(true);
    setShowDebugPanel(true);
    setCurrentDebugNode(triggerNode.id);
    setDebugMessages([{ role: "bot", content: "Flow debugging started. Click 'Step Forward' to walk through each node." }]);
    setDebugSteps([]);
    setDebugInput("");
  }, [nodes]);

  const stepForward = useCallback(() => {
    if (!currentDebugNode) return;
    const node = nodes.find((n) => n.id === currentDebugNode);
    if (!node) return;

    const step: DebugStep = {
      nodeId: node.id,
      label: node.label,
      type: node.type,
      input: "",
      output: "",
    };

    let nextId: string | null = null;

    switch (node.type) {
      case "trigger":
        step.output = "Flow triggered. Proceeding to next node.";
        setDebugMessages((prev) => [...prev, { role: "bot", content: `🟢 Starting flow at "${node.label}"` }]);
        nextId = getNextNode(node.id, edges, nodes);
        break;

      case "ai-response":
        step.input = `Prompt: ${node.prompt || "Default system prompt"}\nModel: ${node.model || "GPT-4"}`;
        step.output = `✅ AI response generated using ${node.model || "GPT-4"}`;
        setDebugMessages((prev) => [...prev,
          { role: "bot", content: `🤖 "${node.label}" — Sending to ${node.model || "GPT-4"}` },
          { role: "bot", content: `💬 ${node.prompt ? `"${node.prompt.substring(0, 60)}..."` : "Processing..."}` },
        ]);
        nextId = getNextNode(node.id, edges, nodes);
        break;

      case "condition":
        step.input = `Condition: ${node.condition || "No condition set"}`;
        const decision = debugInput || "support";
        step.output = `Evaluating: ${node.condition || "true"}`;
        step.decision = decision;
        setDebugMessages((prev) => [...prev,
          { role: "bot", content: `🔀 "${node.label}" — Evaluating condition` },
          { role: "bot", content: `Condition: ${node.condition || "true"}` },
          { role: "bot", content: `Decision: Taking "${decision}" branch →` },
        ]);
        nextId = getNextNode(node.id, edges, nodes, decision);
        break;

      case "user-input":
        step.input = debugInput || "Waiting for user input...";
        step.output = `Received: "${debugInput || "No input"}"`;
        setDebugMessages((prev) => [...prev,
          { role: "bot", content: `💬 "${node.label}" — Waiting for user input` },
          ...(debugInput ? [{ role: "user" as const, content: debugInput }] : []),
        ]);
        nextId = getNextNode(node.id, edges, nodes);
        break;

      case "api-call":
        step.output = "🌐 API call executed successfully";
        setDebugMessages((prev) => [...prev, { role: "bot", content: `🌐 "${node.label}" — Calling external API` }]);
        nextId = getNextNode(node.id, edges, nodes);
        break;

      case "end":
        step.output = "Flow ended.";
        setDebugMessages((prev) => [...prev, { role: "bot", content: `🔴 "${node.label}" — Flow complete` }]);
        setCurrentDebugNode(null);
        setDebugSteps((prev) => [...prev, step]);
        return;

      default:
        nextId = getNextNode(node.id, edges, nodes);
    }

    setDebugSteps((prev) => [...prev, step]);
    setCurrentDebugNode(nextId);
    setDebugInput("");
  }, [currentDebugNode, nodes, edges, debugInput]);

  const stopDebug = useCallback(() => {
    setDebugMode(false);
    setShowDebugPanel(false);
    setCurrentDebugNode(null);
    setDebugSteps([]);
    setDebugMessages([]);
    setDebugInput("");
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setDebugInput((prev) => prev + transcript);
    };
    recognition.start();
  }, []);

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
    <div className="flex flex-col h-screen">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 h-14 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-500" />
            <input
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="text-lg font-semibold text-slate-900 dark:text-slate-100 bg-transparent border-none outline-none focus:ring-0"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={undo} disabled={historyIndex <= 0} title="Undo (Ctrl+Z)">
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1} title="Redo (Ctrl+Shift+Z)">
            <Redo2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowTemplateDialog(true)} title="Load a template">
            <Zap className="w-4 h-4 mr-1.5" />
            Templates
          </Button>
          <Button variant="outline" size="sm" onClick={importFlow} title="Import flow from JSON file">
            <Download className="w-4 h-4 mr-1.5" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={exportFlow} title="Export flow as JSON file">
            <Upload className="w-4 h-4 mr-1.5" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={copyShareLink} title="Copy shareable link">
            <LinkIcon className="w-4 h-4 mr-1.5" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowVersionPanel(!showVersionPanel)} className={showVersionPanel ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-300" : ""}>
            <History className="w-4 h-4 mr-1.5" />
            Versions
            {versions.length > 0 && (
              <Badge className="ml-1.5 h-5 px-1.5 text-[10px]">{versions.length}</Badge>
            )}
          </Button>
          <Button variant={debugMode ? "default" : "outline"} size="sm" onClick={debugMode ? stopDebug : startDebug} className={debugMode ? "bg-amber-500 hover:bg-amber-600 border-amber-500" : ""}>
            {debugMode ? (
              <><Pause className="w-4 h-4 mr-1.5" /> Stop Debug</>
            ) : (
              <><Bug className="w-4 h-4 mr-1.5" /> Debug</>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={saveVersion}>
            <Save className="w-4 h-4 mr-1.5" />
            Save Version
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Version Panel */}
        {showVersionPanel && (
          <Card className="w-72 shrink-0 rounded-none border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Version History
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowVersionPanel(false)}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-2">
              {versions.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
                  No versions saved yet.<br />Click &quot;Save Version&quot; to create one.
                </p>
              ) : (
                [...versions].reverse().map((v) => (
                  <div
                    key={v.id}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">v{v.version}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {new Date(v.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{v.name}</p>
                    <div className="flex gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => restoreVersion(v)}
                      >
                        <RotateCcw className="w-3 h-3" /> Restore
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => {
                          setNodes(JSON.parse(JSON.stringify(v.nodes)));
                          setSelectedNodeId(null);
                        }}
                      >
                        <ChevronRight className="w-3 h-3" /> Preview
                      </Button>
                    </div>
                    <div className="mt-2 flex gap-1">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {v.nodes.length} nodes
                      </Badge>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {v.edges.length} edges
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* Left Panel - Node Palette */}
        <Card className="shrink-0 rounded-none border-r border-slate-200 dark:border-slate-700 overflow-y-auto" style={{ width: leftPanelWidth }}>
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
                className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 cursor-grab hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
              >
                <div className={`${item.color} p-1.5 rounded-md text-white`}>
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {item.label}
                </span>
                <GripVertical className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 ml-auto" />
              </div>
            ))}
          </CardContent>
        </Card>

        <div
          className="w-1.5 shrink-0 cursor-col-resize bg-transparent hover:bg-indigo-300/50 dark:hover:bg-indigo-700/50 transition-colors relative"
          onMouseDown={() => handleMouseDown("left")}
        >
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4" />
        </div>

        {/* Center - Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 bg-slate-50 dark:bg-slate-950 relative overflow-auto"
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
                      <text x={mid.x} y={mid.y + 4} textAnchor="middle" className="text-xs fill-slate-600 dark:fill-slate-400 font-medium">
                        {edge.label}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Debug mode indicator */}
          {debugMode && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-xs font-medium">
              <Bug className="w-3.5 h-3.5" />
              Debug Mode — Step through each node
            </div>
          )}

          {/* Nodes */}
          {nodes.map((node) => {
            const isDebugActive = debugMode && currentDebugNode === node.id;
            const isDebugVisited = debugSteps.some((s) => s.nodeId === node.id);
            return (
              <div
                key={node.id}
                draggable={!debugMode}
                onDragEnd={(e) => !debugMode && handleDragEnd(node.id, e)}
                onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
                className={`absolute cursor-grab active:cursor-grabbing rounded-lg border-2 px-4 py-3 shadow-md dark:shadow-slate-900/50 min-w-[140px] transition-all ${
                  nodeColors[node.type] || "bg-slate-500 border-slate-600 text-white"
                } ${selectedNodeId === node.id ? "ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-slate-900" : ""}
                  ${isDebugActive ? "ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-slate-900 shadow-lg shadow-amber-200 dark:shadow-amber-900/50 scale-105" : ""}
                  ${isDebugVisited && !isDebugActive ? "opacity-70" : ""}
                `}
                style={{ left: node.x, top: node.y }}
              >
                <div className="flex items-center gap-2">
                  {nodeIcons[node.type]}
                  <span className="text-sm font-medium">{node.label}</span>
                  {isDebugVisited && (
                    <Check className="w-3.5 h-3.5 ml-auto text-white/70" />
                  )}
                  {isDebugActive && (
                    <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping ml-auto" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Panel - Node Properties or Debug Panel */}
        <div
          className="w-1.5 shrink-0 cursor-col-resize bg-transparent hover:bg-indigo-300/50 dark:hover:bg-indigo-700/50 transition-colors relative"
          onMouseDown={() => handleMouseDown("right")}
        >
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4" />
        </div>
        {showDebugPanel && debugMode ? (
          <Card className="shrink-0 rounded-none border-l border-slate-200 dark:border-slate-700 overflow-y-auto flex flex-col" style={{ width: rightPanelWidth + 70 }}>
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Bug className="w-4 h-4 text-amber-500" />
                <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Debug: Step-through
                </CardTitle>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={stopDebug}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </CardHeader>

            {/* Current Node Info */}
            {currentDebugNodeData && (
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-amber-50/50 dark:bg-amber-950/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1 rounded ${nodeColors[currentDebugNodeData.type] || "bg-slate-500"} text-white`}>
                    {nodeIcons[currentDebugNodeData.type]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{currentDebugNodeData.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{currentDebugNodeData.type.replace("-", " ")}</p>
                  </div>
                </div>
                {currentDebugNodeData.type === "condition" && (
                  <div className="mt-2">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Test Decision Branch</label>
                    <div className="flex gap-1.5 mt-1">
                      {edges.filter((e) => e.source === currentDebugNodeData.id).map((edge) => (
                        <Button
                          key={edge.id}
                          size="sm"
                          variant={debugInput === edge.label ? "default" : "outline"}
                          className="h-7 text-xs"
                          onClick={() => setDebugInput(edge.label || "true")}
                        >
                          {edge.label || "Default"}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Debug Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {debugMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-3 py-2 rounded-xl text-xs leading-relaxed max-w-[85%] ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white"
                        : msg.content.startsWith("🟢")
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                        : msg.content.startsWith("🤖")
                        ? "bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300"
                        : msg.content.startsWith("🔀")
                        ? "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
                        : msg.content.startsWith("🔴")
                        ? "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
                        : msg.content.startsWith("🌐")
                        ? "bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300"
                        : msg.content.startsWith("💬")
                        ? "bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {!currentDebugNode && debugMessages.length > 0 && (
                <div className="text-center pt-4">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Flow complete</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={startDebug}>
                    <RotateCcw className="w-3 h-3 mr-1" /> Restart
                  </Button>
                </div>
              )}
            </div>

            {/* Debug Controls */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
              {currentDebugNodeData?.type === "user-input" && (
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type test input..."
                    value={debugInput}
                    onChange={(e) => setDebugInput(e.target.value)}
                    className="text-sm h-9"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") stepForward();
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={startListening}
                    title={isListening ? "Stop listening" : "Voice input"}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4 text-red-500" />
                    ) : (
                      <Mic className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    )}
                  </Button>
                  <Button size="icon" className="h-9 w-9 shrink-0" onClick={stepForward}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {currentDebugNode && currentDebugNodeData?.type !== "user-input" && (
                <Button className="w-full gap-2" onClick={stepForward} disabled={!currentDebugNode}>
                  <StepForward className="w-4 h-4" />
                  Step Forward
                  {currentDebugNodeData && (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </Button>
              )}
              <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                <span>Step {debugSteps.length}</span>
                <span>{debugSteps.filter((s) => s.nodeId).length} nodes visited</span>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="shrink-0 rounded-none border-l border-slate-200 dark:border-slate-700 overflow-y-auto" style={{ width: rightPanelWidth }}>
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {selectedNode ? "Node Properties" : "Select a Node"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {selectedNode ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Name</label>
                    <Input
                      value={selectedNode.label}
                      onChange={(e) => updateNodeData("label", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Type</label>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-md capitalize">
                      {selectedNode.type.replace("-", " ")}
                    </div>
                  </div>

                  {selectedNode.type === "ai-response" && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Model</label>
                        <select
                          value={selectedNode.model || ""}
                          onChange={(e) => updateNodeData("model", e.target.value)}
                          className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                        >
                          <option value="GPT-4">GPT-4</option>
                          <option value="GPT-3.5">GPT-3.5</option>
                          <option value="Claude">Claude</option>
                          <option value="Gemini">Gemini</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">System Prompt</label>
                        <Textarea
                          value={selectedNode.prompt || ""}
                          onChange={(e) => updateNodeData("prompt", e.target.value)}
                          rows={4}
                          placeholder="Enter system prompt..."
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
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
                        <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
                          <span>Precise</span>
                          <span>Creative</span>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedNode.type === "condition" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Condition Expression</label>
                      <Textarea
                        value={selectedNode.condition || ""}
                        onChange={(e) => updateNodeData("condition", e.target.value)}
                        rows={3}
                        placeholder="e.g. intent === 'support'"
                      />
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button variant="destructive" size="sm" className="w-full" onClick={deleteNode}>
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
        )}
      </div>

      {/* Template Dialog */}
      {showTemplateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowTemplateDialog(false)}>
          <Card className="w-[480px] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Flow Templates</CardTitle>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowTemplateDialog(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {flowTemplates.map((template) => (
                <div
                  key={template.id}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                  onClick={() => loadTemplate(template)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                      <Bot className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{template.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{template.description}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    <Badge variant="outline" className="text-[10px]">{template.nodes.length} nodes</Badge>
                    <Badge variant="outline" className="text-[10px]">{template.edges.length} edges</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => { setShowOnboarding(false); localStorage.setItem("af_onboarding_seen", "true"); }}>
          <Card className="w-[420px]" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-500" /> Welcome to AgentFlow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-white text-xs font-bold">1</div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Drag nodes from the palette</p>
                    <p className="text-xs text-slate-500 mt-0.5">Choose triggers, AI responses, conditions, and more from the left panel.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-white text-xs font-bold">2</div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Connect them together</p>
                    <p className="text-xs text-slate-500 mt-0.5">Drag from node to node to create conversation paths. Label your connections.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-white text-xs font-bold">3</div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Configure each node</p>
                    <p className="text-xs text-slate-500 mt-0.5">Click a node to edit its properties in the right panel — prompts, models, conditions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white text-xs font-bold">⚡</div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Test with Debug mode</p>
                    <p className="text-xs text-slate-500 mt-0.5">Click &quot;Debug&quot; to step through your flow node by node. See exactly what happens at each step.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white text-xs font-bold">4</div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Save &amp; share</p>
                    <p className="text-xs text-slate-500 mt-0.5">Save versions, export as JSON, or share via link. Your flows are always backed up.</p>
                  </div>
                </div>
              </div>
              <Button className="w-full" onClick={() => { setShowOnboarding(false); localStorage.setItem("af_onboarding_seen", "true"); }}>
                Get started
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
