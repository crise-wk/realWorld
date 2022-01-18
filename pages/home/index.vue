<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{
                    active:tab === 'your_feed'
                  }"
                  :to="{
                    name:'home',
                    query:{
                      tab:'your_feed'
                    }
                  }"
                >Your Feed</nuxt-link>
              </li>
              <li class="nav-item" >
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{
                    active:tab === 'global_feed'
                  }"
                  :to="{
                    name:'home',
                    query:{
                      tab:'global_feed'
                    }
                  }"
                >Global Feed</nuxt-link>
              </li>
              <li class="nav-item" v-if="tag">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active:tag === 'tag'
                  }"
                  exact
                  :to="{
                    name:'home',
                    query:{
                      tab:'tag',
                      tag:tag
                    }
                  }"
                >#{{tag}}</nuxt-link>
              </li>
            </ul>
          </div>
          <div class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link href="profile.html"
                :to="{
                  name:'profile',
                  params:{
                    username:article.author.username
                  }  
                }"
              >
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="author">
                <nuxt-link href="profile.html"
                  :to="{
                    name:'profile',
                    params:{
                      username:article.author.username
                    }  
                  }"
                >
                  {{article.author.username}}
                </nuxt-link>
                <span class="date">{{article.createdAt | date('MMM DD ')}}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active:article.favorited
                }"
                @click="onFavorite(article)"
                :disabled = "article.favoriteDisabled"
              >
                <i class="ion-heart"></i>{{article.favoritesCount}}
              </button>
            </div>
            <nuxt-link :to="{name:'article',params:{slug:article.slug}}" class="preview-link">
              <h1>{{article.title}}</h1>
              <p> {{article.description}}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li class="page-item"
                :class="{
                  active: item ===page
                }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link class="page-link"
                  :to="{
                    name:'home',
                    query:{
                      page:item,
                      tag:$route.query.tag,
                      tab:tab
                    }
                  }"
                >{{item}}</nuxt-link>
              </li>
            </ul>
          </nav>
          <!-- 分页列表 -->

        </div>
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <nuxt-link 

                class="tag-pill tag-default"
                v-for="item in tags"
                :key = "item"
                :to="{
                  name:'home',
                  query:{
                    tab:'tag',
                    tag:item
                  }
                }"
              >{{ item }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles,getFeedArticles,addFavorite,deleteFavorite } from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'

export default {
  name: "HomeIndex",
  methods: {},
  watchQuery:['page','tag','tab'],
  async asyncData ({query,store}) {
    const page = Number.parseInt(query.page||1)
    const limit = 2
    const { tag,tab ='global_feed' } = query
    

    const loadArticles = store.state.user &&tab === 'your_feed'? getFeedArticles:getArticles
    const [dataRes,tagRes] = await Promise.all([
      loadArticles({
        limit,
        offset:(page-1)*limit,
        tag
      }),
      getTags()
    ])
    const { data } = dataRes
    const { data:tagData } = tagRes

    data.articles.forEach(article=>article.favoriteDisabled = false)

    return {
      articles:data.articles,
      articlesCount:data.articlesCount,
      tags:tagData.tags,
      limit,
      page,
      tag,
      tab
    }
  },
  computed:{
    ...mapState(['user']),
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods:{
    async onFavorite (article) {
      article.favoriteDisabled = true
      if(article.favorited) {
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoriteCount += -1 
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoriteCount += 1 
      }
      article.favoriteDisabled = false

    }
  }

};
</script>

<style>
</style>
