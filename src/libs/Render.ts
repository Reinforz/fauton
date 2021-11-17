import fs from 'fs';
import { GraphNode } from '../types';

export class Render {
	static graphToHtml(graph: GraphNode, htmlFilePath: string) {
		return fs.writeFileSync(
			htmlFilePath,
			`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><style>.node circle{stroke: black;stroke-width: 2px;}.node text{font-weight: bolder;font: 16px sans-serif;}.link{fill: none;stroke: #ccc;stroke-width: 2px;}</style></head><body><script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.min.js"></script><script>const treeData=${JSON.stringify(
				[graph]
			)};const margin={top: 20, right: 120, bottom: 20, left: 120},width=window.innerWidth - margin.right - margin.left,height=window.innerHeight - margin.top - margin.bottom;let i=0;const tree=d3.layout.tree().size([height, width]);const diagonal=d3.svg.diagonal().projection(function (d){return [d.y, d.x];});const svg=d3.select('body').append('svg').attr('width', width + margin.right + margin.left).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');const root=treeData[0];const nodes=tree.nodes(root).reverse(),links=tree.links(nodes);nodes.forEach(function (d){d.y=d.depth * 180;});const node=svg.selectAll('g.node').data(nodes, function (d){return d.id || (d.id=+=1i);});const nodeEnter=node.enter().append('g').attr('class', 'node').attr('transform', function (d){return 'translate(' + d.y + ',' + d.x + ')';});nodeEnter.append('circle').attr('r', 25).style('fill', '#fff');nodeEnter.append('text').attr('x', 15).attr('y', 6).attr('text-anchor', 'end').text(function (d){return d.name;}).style('fill-opacity', 1);const link=svg.selectAll('path.link').data(links, function (d){return d.target.id;});link.enter().insert('path', 'g').attr('class', 'link').attr('d', diagonal);</script></body></html>`
		);
	}
}
