{{/*
Expand the name of the chart.
*/}}
{{- define "ascend.name" -}}
{{- default .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "ascend.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.appName | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Common labels applied to all resources
*/}}
{{- define "ascend.labels" -}}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/part-of: {{ .Values.global.appName | default "ascend" }}
{{- end }}

{{/*
Selector labels for Backend Pods
*/}}
{{- define "ascend.backendSelectorLabels" -}}
app.kubernetes.io/name: {{ include "ascend.name" . }}-backend
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: backend
{{- end }}

{{/*
Selector labels for Web (Frontend) Pods
*/}}
{{- define "ascend.webSelectorLabels" -}}
app.kubernetes.io/name: {{ include "ascend.name" . }}-web
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: web
{{- end }}

{{/*
Selector labels for Redis Pods
*/}}
{{- define "ascend.redisSelectorLabels" -}}
app.kubernetes.io/name: {{ include "ascend.name" . }}-redis
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: redis
{{- end }}

{{/*
Determine the secret name to use across templates
*/}}
{{- define "ascend.secretName" -}}
{{- if .Values.secrets.useExistingSecret }}
{{- .Values.secrets.existingSecretName }}
{{- else }}
{{- printf "%s-secrets" (include "ascend.fullname" .) }}
{{- end }}
{{- end }}
