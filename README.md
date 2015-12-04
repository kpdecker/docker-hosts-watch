# docker-hosts-watch

Helpers for DNS and routing between docker-machine instances and local development machines.

## Usage

### Host Watch

Watches for container start and stop and generates an up to date host file configuration for dnsmasq or etc/hosts.

```
  node index.js watch $outputFile
```


### Route Generator

Helper utility to generate the route table from the development machine to the docker-machine network.

```
  node index.js route
```
