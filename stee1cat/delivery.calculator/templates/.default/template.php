<div class="calc_block">
	<div class="calc_block_title">�������� ��������� ��������</div>
	<div class="calc_subblock">
		<form id="delivery_form">
			<div class="col-sm-8">
				<input id="delivery_destination" name="delivery_destination"
					   type="text" placeholder="������� ����� ��������">
			</div>
			<div class="col-sm-4">
				<input type="submit" value="���������� ���������"
					   class="btn btn-default btn-lg">
			</div>
			<div class="clearfix"></div>
			<div class="col-sm-12">
				<div id="delivery_calc_result"></div>
			</div>
		</form>
		<script>
			$(document).ready(function () {
				new DeliveryCalculator({
					form: $('#delivery_form'),
					result: $('#delivery_calc_result'),
					destinationInput: $('#delivery_destination'),
					cost: '<?= $arParams["COST"]; ?>',
					from: '<?= $arParams["DEPARTURE"]; ?>',
					freeDistance: '<?= $arParams["FREE_DISTANCE"]; ?>'
				});
			});
		</script>
	</div>
</div>