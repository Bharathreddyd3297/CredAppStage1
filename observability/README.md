# CredPay Observability

CredPay's observability and AIOps stack. Terraform and
`azure-pipelines.yml` are never modified, and the application's
architecture (services, routing, data flow) is untouched - the one
exception is `application-metrics/`, which adds a metrics endpoint and
scrape annotations to `user-service` and `payment-service` (additive
only: same ports, same probes, same Deployment strategy). Everything
here is plain Kubernetes YAML (no Helm, no GitOps) built up one technology
at a time, in the order below.

---

## What is Observability

Observability is the ability to ask **new, arbitrary questions** about a
system's internal state, using only the data it already exposes
externally - without shipping new code to answer that specific question.
In practice this rests on three kinds of telemetry:

- **Metrics** - numeric measurements over time (Prometheus, this stack's
  starting point).
- **Logs** - discrete, timestamped event records (Azure Log Analytics /
  Container Insights, later in this roadmap).
- **Traces** - the path a single request took across services (not yet
  part of this roadmap).

## Monitoring vs. Observability

They're related, but not the same thing:

| | Monitoring | Observability |
|---|---|---|
| **Answers** | Questions you already thought to ask (dashboards, known alerts) | Questions you didn't think to ask *until something broke* |
| **Built from** | A fixed set of predefined checks/thresholds | Rich, high-cardinality telemetry you can freely query after the fact |
| **Typical tool in this stack** | AlertManager rules, Grafana dashboards | Prometheus + PromQL, ad-hoc queries against raw metrics |
| **Fails when** | The one thing nobody thought to alert on breaks | (Ideally) never - the data to investigate is already there |

Monitoring is necessary but not sufficient - this roadmap builds
monitoring (Prometheus, Grafana, AlertManager) as the foundation, then
layers true observability and AIOps capability on top of it.

## Complete project roadmap

| Folder | Technology | Status |
|---|---|---|
| `prometheus/01-prometheus-server/` | Prometheus server | **Implemented** |
| `prometheus/02-node-exporter/` | Node Exporter (node CPU/memory/disk) | **Implemented** |
| `prometheus/03-kube-state-metrics/` | kube-state-metrics (K8s object state) | **Implemented** |
| `prometheus/04-prometheus-rules/` | Recording & alerting rules | Planned |
| `grafana/` | Grafana dashboards | **Implemented** |
| `application-metrics/` | Spring Boot + FastAPI custom metrics | **Implemented** |
| `alertmanager/` | AlertManager | Planned |
| `cloud-monitoring/` | Azure Monitor / Log Analytics / Container Insights | Planned |
| `aiops/` | AI-assisted root cause analysis, prediction, remediation | Planned |

Prometheus, Node Exporter, and kube-state-metrics are deployed together
as one simple bundle (`prometheus/deploy.sh`) since Prometheus has no real
cluster visibility without them. Everything after that - Grafana onward -
is still implemented **one technology at a time, in order** - never skip
ahead.

## High-level architecture

```
                              AKS Cluster
        ┌───────────────────────────────────────────────────────┐
        │   credpay namespace              monitoring namespace   │
        │   (architecture unchanged -       (this project)        │
        │    metrics endpoints added)                             │
        │                                                          │
        │   frontend                        Prometheus             │
        │   user-service ──scrape──►            │                  │
        │   payment-service──scrape──►          ├── Node Exporter  │
        │                                       ├── kube-state-metrics
        │                                       │                  │
        │                                    Grafana                │
        │                                    AlertManager (later)  │
        └───────────────────────────────────────────────────────┘
                          │
                 Azure Monitor / Log Analytics
                 (cloud-monitoring/, later)
                          │
                        aiops/
              (root cause analysis, prediction,
                  auto-remediation - final phase)
```

## Folder explanation

- **`prometheus/`** - the metrics collection layer. Numbered subfolders
  (`01-prometheus-server`, `02-node-exporter`, `03-kube-state-metrics`, ...)
  separate each component's manifest for clarity, but `deploy.sh`/
  `verify.sh` at the top of the folder install and check all of them
  together in one pass; `labs/`, `cheatsheets/`, and `interview/` hold
  cross-cutting PromQL practice material that isn't tied to one specific
  component.
- **`grafana/`** - visualization layer, reading from Prometheus.
- **`application-metrics/`** - instrumentation added to CredPay's own
  Spring Boot and FastAPI services (opt-in, additive - never modifies
  existing business logic).
- **`alertmanager/`** - alert routing/notification on top of Prometheus
  rules.
- **`cloud-monitoring/`** - Azure-native monitoring (Azure Monitor, Log
  Analytics, Container Insights) integrated alongside the self-hosted
  stack above.
- **`aiops/`** - the final layer: AI-assisted analysis built on top of
  everything else in this roadmap.

Each implemented technology is kept deliberately simple: one plain YAML
manifest per component, plus a shared `deploy.sh` / `verify.sh` at the
top of its folder - see `prometheus/` for the reference implementation
of that pattern.
