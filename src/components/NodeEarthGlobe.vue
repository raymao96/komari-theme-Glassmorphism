<script setup lang="ts">
import type { NodeData } from '@/stores/nodes'
import { computed, defineAsyncComponent, onErrorCaptured, ref, useAttrs, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { supportsGlobeRenderer } from '@/utils/globeCapability'

const props = defineProps<{
  nodes?: NodeData[]
}>()
const emit = defineEmits<{ rendererChange: [renderer: 'realistic' | 'cobe' | 'tiled'] }>()

const attrs = useAttrs()
const appStore = useAppStore()
const failed = ref(false)
watch(() => appStore.earthRenderer, () => {
  failed.value = false
})
onErrorCaptured(() => {
  if (appStore.earthRenderer === 'tiled' || failed.value)
    return
  failed.value = true
  return false
})

const NodeEarthCobeGlobe = defineAsyncComponent(() => import('@/components/NodeEarthCobeGlobe.vue'))
const NodeEarthRealisticGlobe = defineAsyncComponent(() => import('@/components/NodeEarthRealisticGlobe.vue'))
const NodeEarthTiledMap = defineAsyncComponent(() => import('@/components/NodeEarthTiledMap.vue'))

const effectiveRenderer = computed(() => {
  const renderer = appStore.earthRenderer
  if (renderer !== 'tiled' && (failed.value || !supportsGlobeRenderer(renderer)))
    return 'tiled'
  return renderer
})
watch(effectiveRenderer, renderer => emit('rendererChange', renderer), { immediate: true })
const components = { realistic: NodeEarthRealisticGlobe, cobe: NodeEarthCobeGlobe, tiled: NodeEarthTiledMap }
const earthComponent = computed(() => components[effectiveRenderer.value])
</script>

<template>
  <component :is="earthComponent" v-bind="attrs" :nodes="props.nodes" @render-error="failed = true" />
</template>
