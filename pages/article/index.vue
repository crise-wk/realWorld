<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{article.title}}</h1>
        <article-meta :article="article"></article-meta>
      </div>
    </div>
    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12" :v-html="article.body"></div> 
      </div>
      <hr />
      <div class="article-actions">
        <article-meta :article="article"></article-meta>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <article-comment :article ='article'></article-comment>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import MarkdownIt from 'markdown-it'
  import ArticleMeta from './components/article-meta.vue';
  import ArticleComment from './components/article-comment.vue';
  import { getArticle } from '@/api/article'

export default {
  name: "ArticleIndex",
  computed: {
    isLogin() {
      return this.$route.name === "login";
    },
  },

  async asyncData ({params}) {
    const { data } = await getArticle(params.slug)
    const { article } = data
    const mark = new MarkdownIt()

   article.body = mark.render(article.body)
    return  {
      article
    }
  },
  components:{
    ArticleMeta,
    ArticleComment
  },
  head () {
    return {
      title: `${this.article.title} - RealWorld`,
      meta:[
        {
          hid:"description",name:"description",
          content:this.article.description
        }
      ]
    }
  }
};
</script>

<style>
</style>
