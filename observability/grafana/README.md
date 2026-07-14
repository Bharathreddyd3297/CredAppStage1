# Grafana

The visualization layer on top of Prometheus. Grafana doesn't collect any
metrics itself - it queries Prometheus (already running in `monitoring`)
and turns PromQL into dashboards.

## Why Grafana

Chapter/queries like the ones in
`observability/prometheus/cheatsheets/node-and-pod-status-walkthrough.md`
work fine typed into Prometheus's own Graph page one at a time - but a
dashboard shows many of them together, continuously refreshing, which is
what an actual operations team would stare at day to day.

## Deploy

```bash
bash observability/grafana/deploy.sh
```

Applies the Prometheus datasource (auto-provisioned - no manual "Add data
source" click-through) and the Grafana Deployment/Service/PVC, then waits
for rollout.

## Verify

```bash
bash observability/grafana/verify.sh
```

Checks the Pod, Deployment, PVC, Service, logs, and queries Grafana's own
API from inside its Pod to confirm the Prometheus datasource is already
configured.

## Access

```bash
kubectl port-forward -n monitoring svc/grafana 3000:3000
```

Browse to `http://localhost:3000`.

- **Login:** `admin` / `admin` - Grafana forces a password change on
  first login. This is acceptable here only because Grafana is
  ClusterIP-only (no Ingress, no LoadBalancer, same trust model as
  Prometheus itself) - reachable exclusively via `port-forward`.
- **Datasource:** Go to Connections → Data sources - "Prometheus" is
  already there, pointing at
  `http://prometheus.monitoring.svc.cluster.local:9090`, nothing to
  configure.
- **Fastest path to a dashboard:** Dashboards → New → Import → upload a
  file from `03-dashboards/` (see below) → select the Prometheus
  datasource → Import. Renders immediately, no query typing required.

## Pre-built dashboards (`03-dashboards/`)

| File | Dashboard |
|---|---|
| `credpay-node-status.json` | Node Exporter targets, CPU %, Memory %, Disk free per node |
| `credpay-pod-status.json` | kube-state-metrics target, CredPay pod phase, available replicas, restarts, pods per namespace |

Both use the exact same queries as
`observability/prometheus/cheatsheets/node-and-pod-status-walkthrough.md`.

## Full step-by-step guide

For a slower, click-by-click walkthrough - install, import the pre-built
dashboards, and (optionally) build one panel from scratch to see how
they're made - plus a troubleshooting section, see
`documentation/install-and-dashboard-guide.md`.

## What's deliberately not included

No AlertManager integration yet (a later module). No custom dashboards
beyond the two provided - `04-custom-dashboards/` is reserved for
whatever you build on top of these.
