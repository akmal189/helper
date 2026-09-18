{assign var="show_price" value=0}
{if !(!$user && $shop2.my.hide_prices_non_reg)}
	{assign var="show_price" value=1}
{/if}

{*assign var="amount_min" value=$e.params.amount_min}
{assign var="multiplicity" value=$e.params.amount_multiplicity|default:1*}
{assign var="amount_min" value=$shop2.my.amount_default}
{if !$amount_min}{if $multiplicity}{assign var=amount_min value=$multiplicity}{else}{assign var="amount_min" value=$shop2.my.amount_default|default:1}{/if}{/if}

<div class="shop2-kind-item" style="width:100%;">
	{if $buy}
		<form method="post" action="{$shop2.uri}?mode=cart&amp;action=add" accept-charset="utf-8">
			<input type="hidden" name="kind_id" value="{$e.kind_id}" />
			<input type="hidden" name="product_id" value="{$e.product_id}" />
			<input type="hidden" name="meta" value="{$e.meta|@json_encode|escape}" />
			{*if !$shop2.my.gr_show_collcetions_amount}
				<input type="hidden" name="amount" value="{$amount_min}" />
			{/if*}
	{/if}
			{if !$hide_image}
			<div class="kind-image{if !$e.image_filename} no-image{/if}">
				{if $e.image_filename}
				<a href="{get_seo_url mode="product" alias=$e.alias}"><img src="{s3_img width=$shop2.my.collection_image_width|default:50 height=$shop2.my.collection_image_height|default:50 src=$e.image_filename method=$shop2.my.s3_img_method}" alt="{$e.kind_name}" title="{$e.kind_name}" /></a>
				<div class="verticalMiddle"></div>
				{/if}
			</div>
			{/if}
			<div class="kind-details">
				{if !$hide_name}
				<div class="kind-name">
					<a href="{get_seo_url mode="product" alias=$e.alias}">{$e.name}</a>
					{if $e.weight}<div class="kind-weight">{$e.weight} {$product.weight_unit}</div>{/if}
				</div>
				{/if}
				{if $show_price}
					<div class="kind-price">
						
						{if $buy}
							{if !$hide_amount}
								{include file="global:shop2.2.130-amount-btn.tpl" class="product-amount" collection_list_item=$e}
							{/if}
							
						{/if}
						{if !$hide_price_old}
							{*include file="global:shop2.v2-product-price-old.tpl"*}
							{include file="global:shop2.2.130-product-price-old.tpl"}
						{/if}
						{if !$hide_price}
							{*include file="global:shop2.v2-product-price.tpl" obj=$e*}
							{include file="global:shop2.2.130-product-price.tpl" obj=$e}
						{/if}
						{if !$hide_buy_button}
						{*include file="global:shop2.2.130-buy-btn.tpl" type=2 collection_list_item=$e*}
						{include file="global:shop2.2.130-buy-btn.tpl" type=3 collection_list_item=$e}
						{/if}
						
					</div>
				{/if}
			</div>
			<div class="shop2-clear-container"></div>
			{*if $show_params}
				{include file="global:shop2.v2-product-params.tpl" unique_values=$shop2.my.unique_values}
			{/if*}

	{if $buy}
		</form>
	{/if}
</div>