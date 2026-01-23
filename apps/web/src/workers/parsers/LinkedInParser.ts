/**
 * LinkedIn Parser
 * @module workers/parsers/LinkedInParser
 *
 * Parses LinkedIn data export files.
 * Handles Connections.csv file.
 */

import { Platform, NodeType, EdgeType } from '@vsg/shared';
import { BaseParser } from './BaseParser';
import type { ParsedResult, ParsingProgress, LinkedInConnection } from './types';

// ============================================================
// LINKEDIN PARSER
// ============================================================

export class LinkedInParser extends BaseParser {
  platform = Platform.LINKEDIN;
  version = 'linkedin_v1.0';
  supportedFiles = ['Connections.csv', 'connections.csv'];

  /**
   * Validate that required files exist
   */
  validateFiles(files: Map<string, ArrayBuffer>): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const hasConnections = this.findFile(files, 'connections.csv') !== null;

    if (!hasConnections) {
      errors.push('Missing required file: Connections.csv');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Parse LinkedIn data
   */
  async parse(
    files: Map<string, ArrayBuffer>,
    onProgress: (progress: ParsingProgress) => void
  ): Promise<ParsedResult> {
    this.reset();

    const fileName = 'linkedin_export.zip';
    let totalFileSize = 0;
    for (const buffer of files.values()) {
      totalFileSize += buffer.byteLength;
    }

    // Phase 1: Validate
    onProgress({
      phase: 'validating',
      current: 0,
      total: 100,
      percentage: 5,
      message: 'Validating file structure...',
    });

    // Create self node
    const selfNode = this.createNode({
      id: 'self',
      username: 'me',
      displayName: 'You',
      type: 'SELF' as NodeType,
    });
    selfNode.displayName = 'You';
    selfNode.username = '@you';
    this.nodeMap.set('self', selfNode);

    // Phase 2: Parse connections
    onProgress({
      phase: 'parsing-following',
      current: 20,
      total: 100,
      percentage: 30,
      message: 'Parsing connections...',
    });

    const connectionsFile = this.findFile(files, 'connections.csv');
    if (connectionsFile) {
      await this.parseConnections(files.get(connectionsFile)!);
    }

    // Phase 3: Build graph (LinkedIn connections are always mutual)
    onProgress({
      phase: 'building-graph',
      current: 70,
      total: 100,
      percentage: 75,
      message: 'Building relationship graph...',
    });

    // Phase 4: Calculate weights
    onProgress({
      phase: 'calculating-weights',
      current: 85,
      total: 100,
      percentage: 90,
      message: 'Calculating edge weights...',
    });

    this.calculateEdgeWeights();
    this.calculateDegrees();

    // Update self node counts (connections are mutual on LinkedIn)
    const self = this.nodeMap.get('self');
    if (self) {
      self.followingCount = self.degree;
      self.followerCount = self.degree;
    }

    // Phase 5: Finalize
    onProgress({
      phase: 'finalizing',
      current: 95,
      total: 100,
      percentage: 98,
      message: 'Finalizing graph data...',
    });

    const result: ParsedResult = {
      nodes: Array.from(this.nodeMap.values()),
      edges: Array.from(this.edgeMap.values()),
      metadata: {
        parseVersion: this.version,
        parsingErrors: this.errors,
        sourceFileInfo: {
          fileName,
          fileSize: totalFileSize,
          checksum: this.calculateChecksum(
            files.values().next().value || new ArrayBuffer(0)
          ),
        },
      },
    };

    onProgress({
      phase: 'finalizing',
      current: 100,
      total: 100,
      percentage: 100,
      message: `Parsed ${result.nodes.length} nodes and ${result.edges.length} edges`,
    });

    return result;
  }

  // ============================================================
  // PRIVATE PARSING METHODS
  // ============================================================

  /**
   * Parse Connections.csv file
   */
  private async parseConnections(buffer: ArrayBuffer): Promise<void> {
    const text = this.readAsText(buffer);
    const lines = text.split('\n');

    if (lines.length < 2) {
      this.addError('EMPTY_FILE', 'Connections.csv appears to be empty');
      return;
    }

    // Parse header to find column indices
    const header = this.parseCSVLine(lines[0]);
    const columnMap = this.buildColumnMap(header);

    // Process each connection
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = this.parseCSVLine(line);
      const connection = this.extractConnection(values, columnMap);

      if (!connection) continue;

      const userId = this.generateUserId(connection.firstName, connection.lastName);

      // Create node for connection
      if (!this.nodeMap.has(userId)) {
        const node = this.createNode({
          id: userId,
          username: `${connection.firstName}_${connection.lastName}`.toLowerCase(),
          displayName: `${connection.firstName} ${connection.lastName}`,
          type: 'USER' as NodeType,
        });
        this.nodeMap.set(userId, node);
      }

      // LinkedIn connections are always mutual
      this.createOrUpdateEdge('self', userId, 'MUTUAL' as EdgeType);
    }
  }

  /**
   * Build column map from header
   */
  private buildColumnMap(header: string[]): Record<string, number> {
    const map: Record<string, number> = {};

    header.forEach((col, index) => {
      const normalized = col.toLowerCase().trim();
      if (normalized.includes('first name')) map.firstName = index;
      if (normalized.includes('last name')) map.lastName = index;
      if (normalized.includes('email')) map.email = index;
      if (normalized.includes('company')) map.company = index;
      if (normalized.includes('position')) map.position = index;
      if (normalized.includes('connected on')) map.connectedOn = index;
    });

    return map;
  }

  /**
   * Extract connection from CSV values
   */
  private extractConnection(
    values: string[],
    columnMap: Record<string, number>
  ): { firstName: string; lastName: string; company?: string; position?: string } | null {
    const firstName = values[columnMap.firstName]?.trim();
    const lastName = values[columnMap.lastName]?.trim();

    if (!firstName && !lastName) return null;

    return {
      firstName: firstName || 'Unknown',
      lastName: lastName || '',
      company: values[columnMap.company]?.trim(),
      position: values[columnMap.position]?.trim(),
    };
  }

  /**
   * Parse a CSV line handling quoted values
   */
  private parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    values.push(current.trim());
    return values;
  }

  /**
   * Generate a consistent user ID from name
   */
  private generateUserId(firstName: string, lastName: string): string {
    const name = `${firstName}_${lastName}`.toLowerCase();
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `li_${Math.abs(hash).toString(16)}`;
  }

  /**
   * Find a file in the map (case-insensitive, supports paths)
   */
  private findFile(files: Map<string, ArrayBuffer>, targetName: string): string | null {
    for (const fileName of files.keys()) {
      const normalizedFileName = fileName.toLowerCase();
      const normalizedTarget = targetName.toLowerCase();

      if (normalizedFileName.includes(normalizedTarget)) {
        return fileName;
      }
    }
    return null;
  }
}

export default LinkedInParser;
