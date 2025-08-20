# Database Migrations

This directory contains database migration scripts and schema versioning information for the RV Repair Copilot platform.

## Overview

The RV Repair Copilot uses Pinecone as its primary vector database for storing and retrieving AI embeddings. This document outlines the migration strategy, schema evolution, and versioning approach.

## Migration Strategy

### Versioning Scheme

We use semantic versioning for database schema changes:
- **Major Version**: Breaking changes that require data migration
- **Minor Version**: New features that are backward compatible
- **Patch Version**: Bug fixes and minor improvements

### Migration Types

1. **Schema Migrations**: Changes to vector metadata structure
2. **Index Migrations**: Changes to Pinecone index configuration
3. **Data Migrations**: Bulk data transformations or cleanup
4. **Metadata Migrations**: Updates to indexed metadata fields

## Current Schema Version

**Version**: `1.0.0`
**Last Updated**: December 2024
**Status**: Production Ready

## Migration History

### v1.0.0 - Initial Schema (December 2024)

#### Features
- Basic vector storage with 1536-dimensional embeddings
- Core metadata fields for RV repair information
- Indexed fields for efficient filtering and search
- Support for multiple RV brands and components

#### Schema Fields
```json
{
  "brand": "string (required, indexed)",
  "component": "string (required, indexed)",
  "manualType": "string (required, indexed, default: 'service')",
  "year": "integer (indexed, range: 1980-2030)",
  "model": "string (indexed)",
  "source": "string (required, indexed)",
  "chunkIndex": "integer (required, indexed)",
  "totalChunks": "integer (required, indexed)",
  "fileHash": "string (required, indexed)",
  "ingestionDate": "string (required, indexed, ISO 8601)",
  "lastUpdated": "string (indexed, ISO 8601)",
  "confidence": "number (indexed, range: 0.0-1.0)",
  "language": "string (indexed, default: 'en')",
  "category": "string (indexed)",
  "difficulty": "string (indexed)",
  "estimatedTime": "string (indexed)",
  "toolsRequired": "array (indexed)",
  "safetyLevel": "string (indexed)",
  "oemPartNumbers": "array (indexed)",
  "warrantyInfo": "string (indexed)"
}
```

#### Index Configuration
- **Dimension**: 1536 (OpenAI text-embedding-ada-002)
- **Metric**: Cosine similarity
- **Pod Type**: p1.x1 (Production)
- **Replicas**: 1
- **Auto-refresh**: Enabled (hourly)

## Planned Migrations

### v1.1.0 - Enhanced Metadata (Q1 2025)

#### Planned Features
- Additional safety and compliance fields
- Enhanced OEM part number tracking
- Support for multiple languages
- Advanced filtering capabilities

#### New Fields
```json
{
  "complianceStandards": "array (indexed)",
  "certificationRequired": "boolean (indexed)",
  "estimatedCost": "object (indexed)",
  "skillPrerequisites": "array (indexed)",
  "relatedProcedures": "array (indexed)",
  "videoTutorials": "array (indexed)",
  "userRatings": "object (indexed)",
  "lastVerified": "string (indexed, ISO 8601)"
}
```

### v1.2.0 - Multi-Modal Support (Q2 2025)

#### Planned Features
- Image embedding support
- Video content indexing
- Audio transcript embeddings
- Cross-modal search capabilities

#### New Fields
```json
{
  "contentType": "string (indexed)",
  "mediaUrls": "array (indexed)",
  "thumbnailUrl": "string (indexed)",
  "duration": "number (indexed)",
  "resolution": "string (indexed)",
  "fileSize": "number (indexed)"
}
```

## Migration Scripts

### Running Migrations

```bash
# Check current schema version
npm run db:version

# Run pending migrations
npm run db:migrate

# Rollback last migration
npm run db:rollback

# Reset database (development only)
npm run db:reset
```

### Migration Scripts

#### 1. Schema Update Script
```typescript
// scripts/migrateSchema.ts
import { PineconeClient } from '@pinecone-database/pinecone';

export async function migrateSchema(
  fromVersion: string,
  toVersion: string
): Promise<void> {
  // Implementation for schema migration
}
```

#### 2. Data Migration Script
```typescript
// scripts/migrateData.ts
export async function migrateData(
  version: string,
  options: MigrationOptions
): Promise<MigrationResult> {
  // Implementation for data migration
}
```

#### 3. Index Rebuild Script
```typescript
// scripts/rebuildIndex.ts
export async function rebuildIndex(
  options: RebuildOptions
): Promise<void> {
  // Implementation for index rebuilding
}
```

## Backup and Recovery

### Backup Strategy

- **Daily Backups**: Automated daily backups of index data
- **Version Backups**: Schema version snapshots
- **Incremental Backups**: Delta changes since last backup
- **Cross-Region Replication**: Disaster recovery protection

### Recovery Procedures

1. **Schema Recovery**: Restore from version backup
2. **Data Recovery**: Restore from daily backup
3. **Index Recovery**: Rebuild from source documents
4. **Full Recovery**: Complete system restoration

## Monitoring and Validation

### Migration Validation

- **Schema Validation**: Verify metadata structure
- **Data Integrity**: Check for data corruption
- **Performance Testing**: Validate query performance
- **Rollback Testing**: Ensure rollback procedures work

### Monitoring Metrics

- **Migration Success Rate**: Percentage of successful migrations
- **Migration Duration**: Time to complete migrations
- **Data Loss Prevention**: Zero data loss during migrations
- **Performance Impact**: Query performance before/after

## Best Practices

### Before Migration

1. **Backup**: Create complete backup of current data
2. **Test**: Run migration in staging environment
3. **Validate**: Verify migration results
4. **Schedule**: Plan migration during low-traffic periods
5. **Communicate**: Notify team of planned maintenance

### During Migration

1. **Monitor**: Watch migration progress and logs
2. **Validate**: Check data integrity at each step
3. **Rollback Ready**: Keep rollback plan ready
4. **Performance**: Monitor system performance impact

### After Migration

1. **Verify**: Validate all data and functionality
2. **Test**: Run comprehensive test suite
3. **Monitor**: Watch for post-migration issues
4. **Document**: Update migration history and documentation

## Troubleshooting

### Common Issues

#### Migration Failures
- Check Pinecone API limits and quotas
- Verify network connectivity and timeouts
- Review error logs for specific failure reasons
- Ensure sufficient storage and compute resources

#### Data Corruption
- Restore from latest backup
- Re-run migration with validation
- Check for concurrent access issues
- Verify data integrity checks

#### Performance Degradation
- Monitor query performance metrics
- Check index optimization settings
- Review metadata indexing configuration
- Consider index rebuilding if necessary

### Support

For migration-related issues:
- Check migration logs in `logs/migrations/`
- Review Pinecone documentation
- Contact development team
- Create GitHub issue with migration details

## Future Considerations

### Scalability
- **Sharding**: Horizontal index partitioning
- **Replication**: Multi-region data distribution
- **Caching**: Query result caching layer
- **CDN**: Global content delivery

### Advanced Features
- **Real-time Updates**: Live schema changes
- **A/B Testing**: Schema version testing
- **Rolling Updates**: Zero-downtime migrations
- **Automated Validation**: CI/CD migration testing

---

**Note**: Always test migrations in a staging environment before applying to production. Keep backups and rollback procedures ready for emergency situations.