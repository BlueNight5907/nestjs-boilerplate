export interface IDomainMapper<Domain, Entity> {
  toDomain(entity: Entity): Domain;
  toEntity(domain: Domain): Entity;
}

export interface IDtoMapper<Dto, Domain> {
  toDto(domain: Domain): Dto;
  toDtoArray(domains: Domain[]): Dto[];
}
