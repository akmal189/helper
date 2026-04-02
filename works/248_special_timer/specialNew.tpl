{if $anketa}
    {if $smarty.post.params.placeholdered_fields}
    	{assign var=placeholdered_fields value=$placeholdered_fields|default:$smarty.post.params.placeholdered_fields}
    {/if}
    <div class="tpl-anketa" data-api-url="{$anketa.postform_api_uri}" data-api-type="form">
        {*if !$hide_title}
        	<div class="title">{$anketa.name}</div>
        {/if*}
        {if !$anketa.posted}
            <form method="post" action="{$page.url}" data-s3-anketa-id="{$anketa.anketa_id}">
                <input type="hidden" name="params[placeholdered_fields]" value="{$placeholdered_fields}" />
                <input type="hidden" name="form_id" value="{$anketa.anketa_id}">
                <input type="hidden" name="tpl" value="{$use_tpl|default:$smarty.template}">
                {if $anketa.dictionaries}
	                {foreach from=$anketa.dictionaries item=e}
	                    {if $e.type_code=="DIV"}
	                    {*============================================================*}
	                        <h2>{$e.name}</h2>
	                    {elseif $e.type_code=="HTML_BLOCK"}
	                    {*============================================================*}
	                        <div class="tpl-field">{$e.html}</div>
	                    {elseif $e.type_code=="HIDDEN"}
						{*============================================================*}
								<input type="hidden"
                                    size="{$e.size}" 
                                    maxlength="{$e.maxlength}" 
                                    value="{$e.value|htmlspecialchars}" 
                                    name="d[{$e.dictionary_position}]"
                                />
	                    {else}
	                        <div class="tpl-field type-{$e.type_code|lower}{if $e.required==1} field-required{/if}{if $e.error} field-error{/if}">
	                            {if $e.name && $e.type_code!="CHECKBOX" && (!$placeholdered_fields || $e.type_code=="UPLOAD" || $e.type_code=="SELECT" || $e.type_code=="MULTI_SELECT" || $e.type_code=="MULTI_CHECKBOX" || $e.type_code=="RADIO_GROUP" || $e.type_code=="CALENDAR_INTERVAL")}
	                                <div class="field-title">{$e.name}:{if $e.required==1} <span class="field-required-mark">*</span>{/if}</div>
	                            {/if}
	                            {if $e.error}
	                                <div class="error-message">{$e.error}</div>
	                            {/if}
	                            <div class="field-value">
	                                {if $e.type_code=="TEXT" || $e.type_code=="EMAIL" || $e.type_code=="PHONE"}
	                                {*============================================================*}
	                                    <input type="text" 
	                                    	{if $e.required==1}required{/if}
		                                    size="{$e.size}" 
		                                    maxlength="{$e.maxlength}" 
		                                    value="{$e.value|htmlspecialchars}" 
		                                    name="d[{$e.dictionary_position}]"{if $placeholdered_fields} 
		                                    placeholder="{$e.name}{if $e.required==1} *{/if}"{/if} 
	                                    />
	                                {elseif $e.type_code=="TEXTAREA"}
	                                {*============================================================*}
	                                    <textarea 
		                                    {if $e.required==1}required{/if}
		                                    cols="{$e.cols}" 
		                                    rows="{$e.rows}" 
		                                    name="d[{$e.dictionary_position}]"{if $placeholdered_fields} 
		                                    placeholder="{$e.name}{if $e.required==1} *{/if}"{/if}>{$e.value|htmlspecialchars}</textarea>
	                                {elseif $e.type_code=="SELECT" || $e.type_code=="MULTI_SELECT"}
	                                {*============================================================*}
	                                    <select size="{$e.size}" 
		                                    {if $e.required==1}required{/if}
		                                    name="d[{$e.dictionary_position}]{if $e.type_code=="MULTI_SELECT"}[]{/if}"{if $e.type_code=="MULTI_SELECT"} 
		                                    multiple="multiple"{/if}>
	                                        <option value="">{#ANKETA_USER_NOT_SELECTED#}</option>
	                                        {foreach from=$e.options item=option}
	                                            <option{if $option.selected==true} selected="selected"{/if} value="{$option.name}">{$option.name}</option>
	                                        {/foreach}
	                                    </select>
	                                {elseif $e.type_code=="CHECKBOX" || $e.type_code=="MULTI_CHECKBOX" || $e.type_code=="RADIO_GROUP"}
	                                {*============================================================*}
	                                    <ul>
	                                        {if $e.type_code=="CHECKBOX"}
	                                            <li>
	                                            	<label>
	                                            		<input 
		                                            		{if $e.required==1}required{/if}
		                                            		type="checkbox"{if $e.value==$e.name|strip_tags} 
		                                            		checked="checked"{/if} 
		                                            		value="#ON#" 
		                                            		name="d[{$e.dictionary_position}]" 
	                                            		/>
	                                            		{$e.name}
	                                        		</label>
	                                        	</li>
	                                        {else}
	                                            {foreach from=$e.options item=option}
	                                                <li>
	                                                	<label>
	                                                		<input 
	                                                			{if $e.required==1 && $e.type_code=="RADIO_GROUP"} required {/if} 
	                                                			type="{if $e.type_code=="RADIO_GROUP"}radio{else}checkbox{/if}"{if $option.selected==true} 
		                                                		checked="checked"{/if} 
		                                                		value="{$option.name}" 
		                                                		name="d[{$e.dictionary_position}][]" 
	                                                		/>
	                                                		{$option.name}
	                                            		</label>
	                                        		</li>
	                                            {/foreach}
	                                        {/if}
	                                    </ul>
	                                {elseif $e.type_code=="CALENDAR"}
	                                {*============================================================*}{assign var=has_callendar value=1}
	                                    <span>
	                                    	<input type="text" size="15" readonly="readonly" 
		                                    	value="{$e.value|escape}" 
		                                    	name="d[{$e.dictionary_position}]" 
		                                    	id="d[{$e.dictionary_position}]" 
		                                    	class="init-calendar"{if $placeholdered_fields} 
		                                    	placeholder="{$e.name}{if $e.required==1} *{/if}"{/if} 
	                                    	/>
	                                	</span>
	                                {elseif $e.type_code=="CALENDAR_INTERVAL"}
	                                {*============================================================*}{assign var=has_callendar value=1}
	                                    <label class="calendar-label">
	                                        {if !$placeholdered_fields}
	                                        	{$e.label_from|default:#ANKETA_CALENDAR_INVERVAL_FROM#}
	                                        {/if}
	                                        <input type="text" size="7" readonly="readonly" 
		                                        value="{$e.value|regex_replace:"/^(d+.d+.d+)[^~]+/":"1"}" 
		                                        id="d[{$e.dictionary_position}][0]" 
		                                        class="tpl-calendar"{if $placeholdered_fields} 
		                                        placeholder="{$e.label_from|default:#ANKETA_CALENDAR_INVERVAL_FROM#}{if $e.required==1} *{/if}"{/if} 
	                                        />
	                                    </label>
	                                    <label class="calendar-label">
	                                        {if !$placeholdered_fields}{$e.label_to|default:#ANKETA_CALENDAR_INVERVAL_TO#}{/if}
	                                        <input type="text" size="7" readonly="readonly" 
		                                        value="{$e.value|regex_replace:"/[^~]+?(d+.d+.d+)$/":"1"}" 
		                                        id="d[{$e.dictionary_position}][1]" 
		                                        class="tpl-calendar"{if $placeholdered_fields} 
		                                        placeholder="{$e.label_to|default:#ANKETA_CALENDAR_INVERVAL_TO#}{if $e.required==1} *{/if}"{/if} 
	                                        />
	                                    </label>
	                                    <input class="init-calendar-interval" type="hidden" 
		                                    value="{$e.value|escape}" 
		                                    name="d[{$e.dictionary_position}]" 
		                                    id="d[{$e.dictionary_position}]" 
	                                    />
	                                    <div class="s3-calendar-note" style="font-size:11px;">{#BOTH_FIELD_REQUIRED#}</div>
	                                {elseif $e.type_code=="UPLOAD"}
	                                {*============================================================*}
		                                {if !$_upload_css_attached}
		                                    {assign var="_upload_css_attached" value="1"}
		                                	<link type="text/css" rel="stylesheet" href="/shared/s3/swfupload/default.css" />
		                                    <script type="text/javascript" src="/shared/s3/plupload/plupload.all.pack.js"></script>
		                                {/if}
		                                {if $e.uploaded}
		                                    <div class="upload-progress">
		                                        {foreach from=$e.uploaded item=upload}
		                                            <div class="progressWrapper">
		                                                <div class="progressContainer">
		                                                    <div class="progressName">{$upload.filename}</div>
		                                                    <div class="progressBarStatus">{#UPLOADED#}...</div>
		                                                    <div class="progressBarComplete"></div>
		                                                </div>
		                                            </div>
		                                        {/foreach}
		                                        <input type="hidden" name="d[{$e.dictionary_position}]" value="{$e.uploaded_str|escape}" />
		                                    </div>
		                                {else}
		                                	{assign var=unique_key value=$rand|default:1|rand:1000}
		                                    <script type="text/javascript">
		                                        var JS_FORM_REQUIRED_FIELD = '{#BOARD_FILL_REQUIRED_FIELDS#}';
		                                        newSWFU({$unique_key}, {if $e.required==1}true{else}false{/if}, {$e.count}, "{$e.upload_url}", "{$e.upload_field}", "{$e.maxsize} MB", "{$e.filetypes.1}", "{$e.filetypes.0}", "{$e.buttontitle}");
		                                    </script>
		                                    <div class="upload-progress" id="fsUploadProgress{$unique_key}"></div>
		                                    <div class="upload-button">
		                                    	<span id="spanButtonPlaceHolder{$unique_key}"></span>
		                                    	{if $e.count}<span class="upload-count">{#NO_MORE#}: {$e.count}</span>{/if}
		                                	</div>
		                                	<input type="hidden" name="d[{$e.dictionary_position}]" id="hidUploadField{$unique_key}" value="" />
		                                {/if}
	                                {/if}{*==========================КОНЕЦ==================================*}
	                                
	                                {if $e.note!=""}
	                                	<div class="field-note">
	                                		{$e.note}
	                            		</div>
	                            	{/if}
	                            </div>
	                        </div>
	                    {/if}
	                {/foreach}

        		{/if}
        		
                {if $anketa.captcha}
                    <div class="tpl-field tpl-field-captcha field-required{if $anketa.captcha_error} field-error{/if}">
                        {if $anketa.captcha_error}<div class="error-message">{#WRONG_CAPTCHA_ERROR#}</div>{/if}
                        <div class="field-value">
                            {captcha name="_cn"}
                        </div>
                    </div>
                {/if}

                <div class="tpl-field tpl-field-button">
                	<div class="sample-close">Нет спасибо</div>
                    <button type="submit" class="tpl-form-button">{$anketa.submit_name}</button>
                </div>

            </form>
            
        	{if $has_callendar}<script type="text/javascript" src="/shared/misc/calendar.gen.js"></script>{/if}
        	
        {else}
            <div class="tpl-anketa-success-note">{$anketa.success_note}</div>
        {/if}
    </div>
{/if}