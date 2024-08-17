---
layout: main.njk
title: Posts
eleventyExcludeFromCollections: true
---

# {{ title }}

<div>
    {%- for post in collections.posts | reverse -%}
        <section>
            <h3><a href="{{ post.url }}">{{ post.data.title }}</a></h3>
            <time datetime="{{ post.date | isoDate }}">{{ post.date | readableDate }}</time>
            <p>{{ post.data.tags | toHashtags }}</p>
        </section>
    {%- endfor -%}
</div>
