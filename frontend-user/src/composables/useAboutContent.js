import { shallowRef } from 'vue'
import { defaultAboutContent } from '@/data/aboutContent'
import { normalizeAboutContent } from '@/utils/normalizeAboutContent'

export const useAboutContent = (source = defaultAboutContent) => {
  const sections = shallowRef(normalizeAboutContent(source))

  const loadAboutContent = async (content = source) => {
    const data = typeof content === 'function' ? await content() : await content
    sections.value = normalizeAboutContent(data)
    return sections.value
  }

  const refreshAboutContent = () => loadAboutContent(source)

  return {
    sections,
    loadAboutContent,
    refreshAboutContent
  }
}
