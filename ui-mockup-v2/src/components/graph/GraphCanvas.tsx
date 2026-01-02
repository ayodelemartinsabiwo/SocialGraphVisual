import * as React from 'react';
import * as d3 from 'd3';
import { cn } from '../../lib/utils';

interface Node extends d3.SimulationNodeDatum {
    id: string;
    group: number;
    val: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
    source: string | Node;
    target: string | Node;
    value: number;
}

interface GraphData {
    nodes: Node[];
    links: Link[];
}

export function GraphCanvas({ data, className }: { data: GraphData; className?: string }) {
    const svgRef = React.useRef<SVGSVGElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!data || !svgRef.current || !containerRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous render

        // Zoom behavior
        const g = svg.append("g");
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 4])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });
        svg.call(zoom);

        // Color scale based on VSG palette
        const color = d3.scaleOrdinal<number, string>()
            .domain([1, 2, 3, 4, 5, 6, 7, 8])
            .range([
                '#F97316', // Orange
                '#3B82F6', // Blue
                '#10B981', // Green
                '#8B5CF6', // Purple
                '#EC4899', // Pink
                '#F59E0B', // Amber
                '#06B6D4', // Cyan
                '#84CC16'  // Lime
            ]);

        // Simulation
        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius((d: any) => Math.sqrt(d.val) * 4 + 2));

        // Links
        const link = g.append("g")
            .attr("stroke", "#E5E5E5") // vsg-neutral-200
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(data.links)
            .join("line")
            .attr("stroke-width", (d) => Math.sqrt(d.value));

        // Nodes
        const node = g.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(data.nodes)
            .join("circle")
            .attr("r", (d) => Math.sqrt(d.val) * 4)
            .attr("fill", (d) => color(d.group))
            .attr("cursor", "pointer")
            .call(drag(simulation) as any);

        node.append("title")
            .text((d) => d.id);

        // Labels (optional, for larger nodes)
        const label = g.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(data.nodes.filter(d => d.val > 5)) // Only label important nodes
            .join("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(d => d.id)
            .style("font-family", "var(--font-sans)")
            .style("font-size", "10px")
            .style("fill", "#525252") // vsg-neutral-600
            .style("pointer-events", "none");


        simulation.on("tick", () => {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            node
                .attr("cx", (d: any) => d.x)
                .attr("cy", (d: any) => d.y);

            label
                .attr("x", (d: any) => d.x)
                .attr("y", (d: any) => d.y);
        });

        function drag(simulation: d3.Simulation<Node, undefined>) {
            function dragstarted(event: any) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event: any) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event: any) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }

        return () => {
            simulation.stop();
        };
    }, [data]);

    return (
        <div ref={containerRef} className={cn("w-full h-full bg-white dark:bg-vsg-neutral-900 relative overflow-hidden", className)} style={{
            backgroundImage: 'radial-gradient(circle, var(--vsg-color-neutral-200) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
        }}>
            <svg ref={svgRef} className="w-full h-full" />

            {/* Legend Overlay */}
            <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-vsg-neutral-900/90 backdrop-blur p-3 rounded-lg border border-vsg-neutral-200 dark:border-vsg-neutral-800 shadow-sm text-xs">
                <h4 className="font-semibold mb-2">Communities</h4>
                <div className="space-y-1">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-vsg-orange-500"></div><span>Tech</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-vsg-info"></div><span>Design</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-vsg-success"></div><span>Marketing</span></div>
                </div>
            </div>
        </div>
    );
}
