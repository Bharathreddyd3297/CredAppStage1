# Prometheus

The metrics-collection layer of CredPay's observability stack: Prometheus
itself, plus the two exporters it needs to see the whole cluster (Node
Exporter for machine metrics, kube-state-metrics for Kubernetes object
state). Deployed together, as plain Kubernetes YAML - no Helm.

## What is Prometheus

Prometheus is an open-source metrics collection and query system. It
**pulls** metrics from targets on a schedule (rather than targets pushing
to it), stores them as time series in its own on-disk database (TSDB),
and exposes PromQL for querying that data - live, ad-hoc, or as the basis
for dashboards (Grafana, next) and alerts (AlertManager, a later module).

## Why Prometheus alone isn't enough

Prometheus only scrapes what something exposes. Out of the box, that's
just itself and the Kubernetes API/kubelets - it has no visibility into
real OS-level resource usage (CPU, memory, disk, network per node) or
into Kubernetes object state (is this Deployment fully rolled out? is
this HPA scaling?). That's what the two exporters below add:

| Folder | Adds | Answers |
|---|---|---|
| `01-prometheus-server/` | Prometheus itself | "What metrics exist, and how do I query them?" |
| `02-node-exporter/` | Real node-level CPU/memory/disk/network | "Is this node under resource pressure?" |
| `03-kube-state-metrics/` | Deployment/Pod/ReplicaSet/DaemonSet/Namespace/Service/HPA state | "Is this Deployment healthy, from the API server's point of view?" |

`04-prometheus-rules/` (recording/alerting rules) comes later, once
there's a real need to alert on what's being collected here.

## Deploy

```bash
bash observability/prometheus/deploy.sh
```

Applies all three (Prometheus, Node Exporter, kube-state-metrics) in
order and waits for each rollout. Safe to re-run (`kubectl apply` is
idempotent).

## Verify

```bash
bash observability/prometheus/verify.sh
```

Checks Pods (including one Node Exporter Pod per cluster node), the
Prometheus/kube-state-metrics Deployments, the PVC, each component's
logs, and queries Prometheus's own Targets API directly from inside its
Pod to confirm every scrape job reports `"health":"up"`.

## Access the UI

```bash
kubectl port-forward -n monitoring svc/prometheus 9090:9090
```

Then browse to `http://localhost:9090` - **Graph** to run PromQL,
**Status → Targets** to see every scrape job's health.

No Ingress, no LoadBalancer - Prometheus is an internal tool, reachable
only via `port-forward`.

---

Supporting material spanning all of Prometheus lives in `labs/`
(hands-on exercises), `cheatsheets/` (quick PromQL/`kubectl` reference),
and `interview/` (interview-style Q&A) - populated as needed.
