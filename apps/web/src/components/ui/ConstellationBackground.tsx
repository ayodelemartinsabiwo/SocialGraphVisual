import { useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';

/**
 * Node configuration for the constellation
 */
interface ConstellationNode {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  glowIntensity: number;
  communityColor: string;
  baseColor: string;
  colorShiftTimer: number;
  colorShiftDuration: number;
  isShifting: boolean;
  targetColor: string;
}

interface ConstellationBackgroundProps {
  /** Number of nodes to render */
  nodeCount?: number;
  /** Whether to animate the nodes */
  animate?: boolean;
  /** Opacity of the effect (0-1) */
  opacity?: number;
  /** Color theme: 'orange' | 'blue' | 'purple' | 'mixed' */
  colorTheme?: 'orange' | 'blue' | 'purple' | 'mixed';
  /** Distance for connecting nodes */
  connectionDistance?: number;
  /** Additional className */
  className?: string;
  /** Show glow effect */
  showGlow?: boolean;
  /** Animation speed multiplier */
  speedMultiplier?: number;
  /** Mouse interaction distance */
  mouseDistance?: number;
  /** Enable occasional color shifting */
  enableColorShift?: boolean;
}

/**
 * All available colors for shifting
 */
const allColors = [
  '#F97316', '#EA580C', '#FB923C', // Orange
  '#3B82F6', '#2563EB', '#60A5FA', // Blue
  '#8B5CF6', '#7C3AED', '#A78BFA', // Purple
  '#22C55E', '#16A34A', '#4ADE80', // Green
  '#EC4899', '#DB2777', '#F472B6', // Pink
];

/**
 * Community colors matching VSG design system
 */
const communityColors = {
  orange: ['#F97316', '#EA580C', '#FB923C'],
  blue: ['#3B82F6', '#2563EB', '#60A5FA'],
  purple: ['#8B5CF6', '#7C3AED', '#A78BFA'],
  green: ['#22C55E', '#16A34A', '#4ADE80'],
  pink: ['#EC4899', '#DB2777', '#F472B6'],
};

/**
 * Get colors based on theme
 */
function getThemeColors(theme: string): string[] {
  switch (theme) {
    case 'orange':
      return communityColors.orange;
    case 'blue':
      return communityColors.blue;
    case 'purple':
      return communityColors.purple;
    case 'mixed':
    default:
      return [
        ...communityColors.orange,
        ...communityColors.blue,
        ...communityColors.purple,
        ...communityColors.green,
        ...communityColors.pink,
      ];
  }
}

/**
 * Interpolate between two hex colors
 */
function lerpColor(color1: string, color2: string, t: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * ConstellationBackground Component
 *
 * An animated network graph background effect that shows interconnected
 * nodes with varying sizes and glowing edges. Responds to cursor movement.
 * Represents the network visualization users will see when they upload their data.
 *
 * Features:
 * - Canvas rendering for smooth 60fps animations
 * - Dynamic edge connections based on distance
 * - Mouse interaction - nodes subtly repel from cursor
 * - Varying node sizes (influencers, bridges, regular)
 * - Glow effects on larger nodes
 * - Occasional color shifting for visual interest
 */
function ConstellationBackground({
  nodeCount = 30,
  animate = true,
  opacity = 0.5,
  colorTheme = 'mixed',
  connectionDistance = 150,
  className,
  showGlow = true,
  speedMultiplier = 1,
  mouseDistance = 180,
  enableColorShift = false,
}: ConstellationBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const nodesRef = useRef<ConstellationNode[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 }); // Start off-screen
  const dimensionsRef = useRef({ width: 0, height: 0 });

  // Get theme colors
  const colors = useMemo(() => getThemeColors(colorTheme), [colorTheme]);

  // Initialize nodes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    dimensionsRef.current = { width, height };

    // Generate nodes with varying properties
    const nodes: ConstellationNode[] = [];
    for (let i = 0; i < nodeCount; i++) {
      // Vary size based on "importance" - some nodes are BIGGER like influencers
      const isInfluencer = Math.random() < 0.12; // 12% are "influencers" - larger
      const isBridge = Math.random() < 0.15; // 15% are "bridges" - medium
      const isMajorNode = Math.random() < 0.08; // 8% are major nodes - biggest
      
      let size = 2 + Math.random() * 2; // Base size 2-4
      if (isBridge) size = 3.5 + Math.random() * 2; // Bridges: 3.5-5.5
      if (isInfluencer) size = 4.5 + Math.random() * 3; // Influencers: 4.5-7.5
      if (isMajorNode) size = 6 + Math.random() * 4; // Major nodes: 6-10

      const baseColor = colors[Math.floor(Math.random() * colors.length)];

      nodes.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5 * speedMultiplier,
        vy: (Math.random() - 0.5) * 0.5 * speedMultiplier,
        size,
        baseSize: size,
        glowIntensity: isMajorNode ? 0.9 : isInfluencer ? 0.75 : isBridge ? 0.5 : 0.25,
        communityColor: baseColor,
        baseColor: baseColor,
        colorShiftTimer: 0,
        colorShiftDuration: 2000 + Math.random() * 3000, // 2-5 seconds
        isShifting: false,
        targetColor: baseColor,
      });
    }

    nodesRef.current = nodes;
  }, [nodeCount, colors, speedMultiplier]);

  // Animation loop with mouse interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    // Set canvas size with device pixel ratio
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      dimensionsRef.current = { width: rect.width, height: rect.height };
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const { width, height } = dimensionsRef.current;
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Update node positions if animating
      if (animate) {
        nodes.forEach((node) => {
          // Apply velocity
          node.x += node.vx;
          node.y += node.vy;

          // Bounce off edges
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;

          // Keep in bounds
          node.x = Math.max(0, Math.min(width, node.x));
          node.y = Math.max(0, Math.min(height, node.y));

          // Mouse interaction - gentle repulsion
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseDistance && distance > 0) {
            const force = (mouseDistance - distance) / mouseDistance;
            const forceX = (dx / distance) * force * 0.8;
            const forceY = (dy / distance) * force * 0.8;
            node.x -= forceX;
            node.y -= forceY;
          }

          // Color shifting logic
          if (enableColorShift) {
            if (!node.isShifting && Math.random() < 0.001) { // Small chance each frame
              node.isShifting = true;
              node.colorShiftTimer = 0;
              node.targetColor = allColors[Math.floor(Math.random() * allColors.length)];
            }

            if (node.isShifting) {
              node.colorShiftTimer += deltaTime;
              const progress = Math.min(node.colorShiftTimer / node.colorShiftDuration, 1);
              
              // Ease in-out
              const eased = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
              
              if (progress < 0.5) {
                // Shift to target color
                node.communityColor = lerpColor(node.baseColor, node.targetColor, eased * 2);
              } else {
                // Shift back to base color
                node.communityColor = lerpColor(node.targetColor, node.baseColor, (eased - 0.5) * 2);
              }

              if (progress >= 1) {
                node.isShifting = false;
                node.communityColor = node.baseColor;
              }
            }
          }
        });
      }

      // Draw edges between nearby nodes (DYNAMIC - based on current positions)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeA = nodes[i];
          const nodeB = nodes[j];
          
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            // Opacity based on distance (closer = more visible)
            const edgeOpacity = (1 - distance / connectionDistance) * opacity;
            
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            
            // Use the color of the nodes for edges
            const edgeColor = nodeA.isShifting || nodeB.isShifting
              ? lerpColor(nodeA.communityColor, nodeB.communityColor, 0.5)
              : `rgba(249, 115, 22, ${edgeOpacity})`;
            
            if (nodeA.isShifting || nodeB.isShifting) {
              ctx.strokeStyle = hexToRgba(edgeColor, edgeOpacity);
            } else {
              ctx.strokeStyle = edgeColor;
            }
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        // Glow effect for larger nodes
        if (showGlow && node.glowIntensity > 0.2) {
          const glowRadius = node.size * 4;
          const glowGradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, glowRadius
          );
          glowGradient.addColorStop(0, hexToRgba(node.communityColor, node.glowIntensity * opacity * 0.6));
          glowGradient.addColorStop(1, hexToRgba(node.communityColor, 0));
          
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = glowGradient;
          ctx.fill();
        }

        // Node circle - higher opacity for visibility
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(node.communityColor, opacity);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, opacity, showGlow, connectionDistance, mouseDistance, enableColorShift]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'absolute inset-0 w-full h-full pointer-events-auto',
        className
      )}
      aria-hidden="true"
    />
  );
}

/**
 * Convert hex color to rgba string
 */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default ConstellationBackground;
